 document.addEventListener('DOMContentLoaded', function() {
      // Update last checked time
      function updateLastChecked() {
        const now = new Date();
        document.getElementById('last-checked').textContent = 
          now.toLocaleTimeString() + ' - ' + now.toLocaleDateString();
      }
      
      // Known working services - manually configured
      const knownWorkingServices = {
        'https://mail.elkanaouet.com': true, // Mail service works on HTTPS
        'https://www.elkanaouet.tn': true,   // Original website URL
        'https://elkanaouet.tn': true,       // Redirected website URL
        // Add other known working services here
      };

      // Test URL function with improved logic
      async function testUrl(url) {
        console.log('Testing URL:', url);

        // Check if this is a known working service FIRST - this takes priority
        if (knownWorkingServices[url]) {
          console.log('URL is in known working services, returning true:', url);
          return true;
        }

        // For internal services (10.x.x.x), try direct fetch
        if (url.includes('10.1.')) {
          console.log('Testing internal service:', url);
          try {
            await fetch(url, {
              method: 'HEAD',
              mode: 'no-cors',
              cache: 'no-store'
            });
            // For no-cors mode, if no error is thrown, assume it's working
            console.log('Internal service appears to be working:', url);
            return true;
          } catch (e) {
            console.log('Internal service failed:', url, e);
            return false;
          }
        }

        // For all other external services, mark as unavailable unless in known list
        // This avoids CORS issues entirely
        console.log('External service not in known list, marking as unavailable:', url);
        return false;
      }
      
      // Test all production URLs
      async function checkAllServices() {
        const productionCards = document.querySelectorAll('#production-grid .dashboard-card');

        for (const card of productionCards) {
          const statusIndicator = card.querySelector('.status-indicator');

          // Skip cards that don't have status indicators (mail, website, and disabled cards)
          if (!statusIndicator || card.classList.contains('disabled-card')) {
            continue;
          }

          const url = card.href;
          const backupCardId = card.getAttribute('data-backup-card');
          const backupCard = document.getElementById(backupCardId);

          // Clear previous status classes
          statusIndicator.classList.remove('valid', 'invalid');

          // Show loading state
          card.classList.add('loading');
          statusIndicator.textContent = '';

          try {
            const isAvailable = await testUrl(url);

            if (isAvailable) {
              statusIndicator.classList.add('valid');
              statusIndicator.textContent = '';
              if (backupCard && !backupCard.classList.contains('disabled-card')) {
                backupCard.classList.remove('active');
              }

              // Add a small indicator if this is a manually configured service
              if (knownWorkingServices[url]) {
                statusIndicator.setAttribute('title', 'Service vérifié manuellement');
              }
            } else {
              statusIndicator.classList.add('invalid');
              statusIndicator.textContent = '';
              if (backupCard && !backupCard.classList.contains('disabled-card')) {
                backupCard.classList.add('active');
              }
            }
          } catch (error) {
            statusIndicator.classList.add('invalid');
            statusIndicator.textContent = '✕';
            if (backupCard && !backupCard.classList.contains('disabled-card')) {
              backupCard.classList.add('active');
            }
          }

          card.classList.remove('loading');
        }

        updateLastChecked();

        // Re-check every 5 minutes
        setTimeout(checkAllServices, 5 * 60 * 1000);
      }
      
      // Initial check
      checkAllServices();
      
      // Manual refresh button
      const refreshBtn = document.createElement('button');
      refreshBtn.className = 'btn btn-sm btn-outline-primary';
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualiser';
      refreshBtn.style.position = 'fixed';
      refreshBtn.style.right = '20px';
      refreshBtn.style.bottom = '20px';
      refreshBtn.style.zIndex = '1000';
      refreshBtn.onclick = checkAllServices;
      document.body.appendChild(refreshBtn);
    });