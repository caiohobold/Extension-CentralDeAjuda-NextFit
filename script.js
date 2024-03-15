const container = document.getElementById('container');
const btn = document.getElementById('buttonPesquisa');

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.create({ 
        url: 'https://ajuda.nextfit.com.br/support/solutions',
        active: false 
    });
});

//Função qie cola o texto do parâmetro para a clipboard
function copyToClipboard(text) {
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
}

//Função para mostrar ou não o ícone de Loading
function toggleLoading() {
    var loader = document.getElementById('loaders');
    loader.style.display = (loader.style.display === 'block') ? 'none' : 'block';

    if (loader.style.display === 'block') {
        setTimeout(function() {
          loader.style.display = 'none';
        }, 1500);
    }
}


//Função que cria a div com os resultados da pesquisa
function criaDiv(){
    const searchInput = document.getElementById('searchInput').value;
    if(searchInput.trim() !== ''){

        //Corta tudo que for "espaços da pesquisa e troca para um símbolo de '+'"
        const palavras = searchInput.split(' ');
        const fraseComMais = palavras.join('+');

        //Forma o link formatado da maneira correta para pesquisa
        const searchUrl = "https://ajuda.nextfit.com.br/support/search/solutions?term=" + fraseComMais;
        


        //Faz um fetch para o link personalizado.
        fetch("https://ajuda.nextfit.com.br/support/search/solutions", {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': 'chrome-extension://gjkkanjnofbfcpidlobkjlnknfjjmjcn',
                'Origin': 'chrome-extension://gcbcddmlplilinibipldbgilbbpkddpd'
            }
        })
            .then(response => {
                console.log('Status da resposta:', response.status);
                if (response.ok) {
                    return response.text();
                  } else {
                    throw new Error('Não foi possível acessar o corpo da resposta');
                  }})
            .then(html => {
                console.log('HTML recebido:', html);
                //Cria uma div
                const tempElement = document.createElement('div');
                tempElement.innerHTML = html;

                //Pega todos os artigos com a classe ".fw-articles li"
                const articles = tempElement.querySelectorAll('.fw-articles li');

                //Remove o botão "Pesquisar"
                const removeSearch = document.createElement('div');
                removeSearch.className = 'close-icon';
                container.appendChild(removeSearch);

                //Para cada artigo encontrado no fetch, ele vai fazer o seguinte:
                articles.forEach(article => {
                    //Pegou o link do artigo na pesquisa
                    const linkElement = article.querySelector('a');
                    //Pegou o título do artigo na pesquisa
                    const titleElement = article.querySelector('p');

                    //Clona o nó do titleElement pra poder utilizar com mais flexibilidade.
                    const titleClone = titleElement.cloneNode(true);

                    titleClone.querySelectorAll('span.ms-4.fw-status-badge.fw-status-badge__best-answer').forEach(span => span.remove());

                    const titleText = titleClone.textContent.trim();

                    const relativeLink = linkElement.getAttribute('href');

                    const absoluteLink = new URL(relativeLink, searchUrl).href;

                    const p = document.createElement('p');
                    p.innerHTML = `<a href="${absoluteLink}" target="_blank">${titleText}</a>`;
                    const copyTitleBtn = document.createElement('button');
                    copyTitleBtn.innerText = 'Titulo';
                    copyTitleBtn.className = "copy"
                    copyTitleBtn.addEventListener('click', function(){
                        copyToClipboard(titleText);
                        copyTitleBtn.innerText = 'Copiado!'
                        copyTitleBtn.style.color = "green"
                        copyTitleBtn.style.border = "1px solid green"
                    });
                    const copyLinkBtn = document.createElement('button');
                    copyLinkBtn.innerText = 'Link';

                    copyLinkBtn.className = "copy";
                    copyLinkBtn.addEventListener('click', function(){
                        copyToClipboard(absoluteLink)
                        copyLinkBtn.innerText = 'Copiado!'
                        copyLinkBtn.style.color = "green"
                        copyLinkBtn.style.border = "1px solid green"
                    });
                    const copyButton = document.createElement('button');
                    copyButton.className = "copy"
                    copyButton.innerText = "Formatado";

                    copyButton.addEventListener('click', function(){
                        const combinedText = `${titleText}\n${absoluteLink}`
                        copyToClipboard(combinedText);
                        copyButton.innerText = 'Copiado!'
                        copyButton.style.color = "green"
                        copyButton.style.border = "1px solid green"
                    })
                    container.appendChild(p);
                    const line = document.createElement('hr');
                    line.className = 'line'
                    p.appendChild(copyTitleBtn);
                    p.appendChild(copyLinkBtn);
                    p.appendChild(copyButton)
                    p.appendChild(line);
                    removeSearch.addEventListener('click', function(){
                        container.querySelectorAll('p').forEach(pElement => {
                            document.getElementById('searchInput').value = '';
                            pElement.remove();

                        })
                        removeSearch.className = "close-icon-remove";
                        container.appendChild(btn)

                    })
                    if(btn){
                        btn.remove();
                    }
                    
                })              
            })
            .catch(error => console.error('Erro na solicitação: ', error));
    }
}

if(btn){
    btn.addEventListener('click', criaDiv)
    document.addEventListener('keydown', function(event){
        if(event.key === 'Enter'){
            criaDiv();
        }
    })
}

