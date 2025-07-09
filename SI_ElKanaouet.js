 document.addEventListener('DOMContentLoaded', function() {
      // Update last checked time
      function updateLastChecked() {
        const now = new Date();
        document.getElementById('last-checked').textContent = 
          now.toLocaleTimeString() + ' - ' + now.toLocaleDateString();
      }
      
      // Test URL function with CORS proxy fallback
      async function testUrl(url) {
        try {
          // First try direct fetch
          const response = await fetch(url, { 
            method: 'HEAD', 
            mode: 'no-cors',
            cache: 'no-store'
          });
          return true;
        } catch (e) {
          // If CORS blocks, try with proxy
          try {
            const proxyResponse = await fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
              method: 'HEAD',
              cache: 'no-store'
            });
            return proxyResponse.ok;
          } catch (proxyError) {
            return false;
          }
        }
      }
      
      // Test all production URLs
      async function checkAllServices() {
        const productionCards = document.querySelectorAll('#production-grid .dashboard-card');
        
        for (const card of productionCards) {
          const url = card.href;
          const backupCardId = card.getAttribute('data-backup-card');
          const backupCard = document.getElementById(backupCardId);
          const statusIndicator = card.querySelector('.status-indicator');
          
          // Show loading state
          card.classList.add('loading');
          statusIndicator.textContent = '';
          
          try {
            const isAvailable = await testUrl(url);
            
            if (isAvailable) {
              statusIndicator.classList.add('valid');
              statusIndicator.textContent = '';
              backupCard.classList.remove('active');
            } else {
              statusIndicator.classList.add('invalid');
              statusIndicator.textContent = '';
              backupCard.classList.add('active');
            }
          } catch (error) {
            statusIndicator.classList.add('invalid');
            statusIndicator.textContent = '✕';
            backupCard.classList.add('active');
          }
          
          card.classList.remove('loading');
        }
        
        updateLastChecked();
        
        // Re-check every 5 minutes
        setTimeout(checkAllServices, 5 * 60 * 1000);
      }
      
      // Initial check
      checkAllServices();
      
    //   // Manual refresh button (optional)
    //   const refreshBtn = document.createElement('button');
    //   refreshBtn.className = 'btn btn-sm btn-outline-primary';
    //   refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualiser';
    //   refreshBtn.style.position = 'absolute';
    //   refreshBtn.style.right = '20px';
    //   refreshBtn.style.bottom = '20px';
    //   refreshBtn.onclick = checkAllServices;
    //   document.querySelector('.dashboard-content').appendChild(refreshBtn);
    });