# Rota da Soja PR — como publicar e instalar

App instalável (PWA) que mostra quanto a soja de cada município do Paraná perde em frete e emite de CO₂ até o Porto de Paranaguá, por caminhão ou com trem. Funciona sem internet depois da primeira visita.

## O que tem nesta pasta

| Arquivo | Para que serve |
|---|---|
| `index.html` | O app |
| `manifest.webmanifest` | Nome, ícone e cores do app instalado |
| `sw.js` | Faz o app funcionar offline |
| `icons/` | Ícones do app |
| `data/cotacao.json` | Preço da saca em Paranaguá que o app usa |
| `data/frete.json` | Frete por tonelada-km que o app usa |
| `.github/workflows/atualizar-cotacao.yml` | Botão para atualizar a cotação pelo celular |

## 1. Publicar no GitHub Pages (uma vez, uns 10 minutos, de preferência no computador)

1. Crie uma conta em github.com, se ainda não tiver.
2. Clique em **New repository**. Nome: `rota-da-soja`. Marque **Public**. Clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file**.
4. Descompacte o .zip e arraste **o conteúdo** da pasta (não a pasta em si) para a página: `index.html`, `manifest.webmanifest`, `sw.js`, `LEIA-ME.md` e as pastas `icons` e `data`. Clique em **Commit changes**.
5. Vá em **Settings → Pages**. Em *Source*, escolha **Deploy from a branch**, branch **main**, pasta **/(root)**, e clique em **Save**.
6. Em 1 a 2 minutos o app estará em `https://SEU-USUARIO.github.io/rota-da-soja/`.

A pasta `.github` costuma ficar escondida ao descompactar. Para criar o botão de atualização, veja o passo 3.

## 2. Instalar no celular

- **Android (Chrome):** abra o link do app, toque nos três pontinhos e em **Instalar app** (ou **Adicionar à tela inicial**).
- **iPhone (Safari):** abra o link, toque em **Compartilhar** e em **Adicionar à Tela de Início**.

Mande o mesmo link para produtores, cooperativas e gestores: eles instalam do mesmo jeito.

## 3. Atualizar a cotação da soja

O app lê o preço de `data/cotacao.json`. A leitura automática do site do Cepea não é permitida a robôs, então a atualização é feita por você, pelo celular, em menos de um minuto.

**Criar o botão (uma vez):** no repositório, vá em **Actions → set up a workflow yourself**, apague o texto do editor, cole o conteúdo de `.github/workflows/atualizar-cotacao.yml` e clique em **Commit changes**. Depois vá em **Settings → Actions → General → Workflow permissions**, marque **Read and write permissions** e salve.

**Usar o botão:** abra o repositório no navegador do celular (ou no app GitHub), vá em **Actions → Atualizar cotação da soja → Run workflow**, preencha o preço (ex.: `154.75`) e a data (ex.: `2026-10-13`) e confirme. Em cerca de 2 minutos todos os celulares com o app recebem o valor novo na próxima vez que abrirem com internet.

O frete (`data/frete.json`) é atualizado todo mês por uma tarefa agendada do Claude, que lê o Boletim Logístico da Conab, ajusta a parte fixa e o valor por km às rotas do Paraná até Paranaguá e envia o arquivo novo. O piso da ANTT (bloco `antt` do mesmo arquivo) muda poucas vezes por ano: quando sair uma nova portaria, troque `ccd`, `cc`, `norma` e `vigencia`.

## 4. Mudar o app

Quando você trocar `index.html` ou `sw.js`, abra `sw.js` e aumente a versão na primeira linha útil (`rota-soja-v1` → `rota-soja-v2`). Assim os celulares descartam a versão antiga salva.

## Fontes e premissas

- Preço: Indicador da Soja Cepea/Esalq – Paranaguá. Cite a fonte ao divulgar.
- Frete de mercado: parte fixa + valor por km ajustados às rotas Toledo, Campo Mourão, Cascavel e Ponta Grossa → Paranaguá do Boletim Logístico da Conab (fretes de ago/2026).
- Piso: preço mínimo da ANTT para granel sólido, 7 eixos (Portaria SUROC nº 22/2026), dividido por 37 t de carga.
- Ferrovia 30% mais barata por km (Coopavel, 2021). Transbordo não incluído.
- Emissões: 0,119 kg CO₂/t·km no caminhão e 0,035 no trem (PBMC, 2013, via ESALQ-LOG).
- Distâncias: linha reta entre as sedes municipais × 1,25 (rodovia) ou × 1,35 (ferrovia). São estimativas, não a quilometragem real.
- Coordenadas dos municípios: base do IBGE compilada em github.com/kelvins/municipios-brasileiros.
