# Env Team Vault - Site Promocional

Este diretório contém o site promocional do Env Team Vault, hospedado no GitHub Pages.

## Estrutura do Site

```
docs/
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos do site
│   ├── js/
│   │   └── script.js       # JavaScript para interatividade
│   └── img/                # Imagens e ícones
│       ├── favicon.png
│       ├── logo.svg
│       ├── logo-white.svg
│       └── og-image.svg    # Imagem para compartilhamento em redes sociais
└── index.html              # Página principal
```

## Visualização Local

Para visualizar o site localmente:

```bash
cd docs
python -m http.server 8000
```

Então acesse `http://localhost:8000` no seu navegador.

## Implantação

O site é automaticamente implantado no GitHub Pages quando mudanças são enviadas para a branch `main`. O workflow do GitHub Actions definido em `.github/workflows/gh-pages.yml` gerencia o processo de implantação.

A URL do site é: [https://paladini.github.io/env-team-vault/](https://paladini.github.io/env-team-vault/)

## Customização

### Adicionando Imagens

Para adicionar novas imagens ao site:

1. Coloque os arquivos de imagem em `docs/assets/img/`
2. Referencie as imagens no HTML usando caminhos relativos: `assets/img/nome-da-imagem.jpg`

### Atualizando Conteúdo

O conteúdo principal está no arquivo `index.html`. Você pode editar este arquivo para atualizar textos, links e seções.

### Modificando Estilos

Os estilos estão no arquivo `assets/css/style.css`. O site usa um sistema de variáveis CSS para cores, espaçamentos e outros elementos de design, facilitando a modificação do tema.

## Responsividade

O site foi projetado para ser totalmente responsivo, funcionando bem em dispositivos móveis, tablets e desktops. A responsividade é gerenciada através de media queries no CSS.

## SEO e Compartilhamento Social

O site inclui tags meta para SEO e compartilhamento em redes sociais (Open Graph e Twitter Cards). Ao fazer atualizações importantes, certifique-se de atualizar essas tags em `index.html`.