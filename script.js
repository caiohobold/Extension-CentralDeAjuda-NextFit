//https://ajuda.nextfit.com.br/support/search/solutions?term=
const container = document.getElementById('container');
const btn = document.getElementById('buttonPesquisa');
const redirectPage = document.getElementById('redirectPage');

function copyToClipboard(text) {
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
}

//const relative = redirectPage.getAttribute('href');
//const absolute = new URL(relative, "app.nextfit.com.br");

//redirectPage.innerHTML = `<a target="_blank" id="redirectPage" href="${absolute}"><img src="logonextfit.png" id="logoNextFit" alt=""></a>`


function toggleLoading() {
    var loader = document.getElementById('loader');
    loader.style.display = (loader.style.display === 'block') ? 'none' : 'block';

    if (loader.style.display === 'block') {
        setTimeout(function() {
          loader.style.display = 'none';
        }, 1500);
    }
}

function criaDiv(){
    setTimeout(toggleLoading(), 3200);
    const searchInput = document.getElementById('searchInput').value;
    if(searchInput.trim() !== ''){
        const palavras = searchInput.split(' ');
        const fraseComMais = palavras.join('+');
        const searchUrl = "https://ajuda.nextfit.com.br/support/search/solutions?term=" + fraseComMais;
        
        fetch(searchUrl)
            .then(Response => Response .text())
            .then(html => {
                const tempElement = document.createElement('div');
                tempElement.innerHTML = html;

                const articles = tempElement.querySelectorAll('.fw-articles li');

                const removeSearch = document.createElement('div');
                removeSearch.className = 'close-icon';
                container.appendChild(removeSearch);


                articles.forEach(article => {
                    const linkElement = article.querySelector('a');
                    const titleElement = article.querySelector('p');

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
                    
                    btn.remove();
                    
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

