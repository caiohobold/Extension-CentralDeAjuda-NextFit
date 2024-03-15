chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({
      url: 'https://ajuda.nextfit.com.br/support/solutions',
      active: false,
      openerTabId: tab.id
    }, function(newTab) {
      chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        function: () => {
          // Seu código JavaScript para interagir com a página aberta em uma nova guia
          console.log('A página foi aberta em uma nova guia.');
          // Exemplo: Alterar o título da página
          document.title = 'Nova página aberta';
        }
      });
    });
  });
