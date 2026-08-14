# Gerador de CV Premium — Moza Empregos

Aplicação em português (Moçambique) que cria currículos com qualidade visual tipo Canva, a partir do CV antigo do utilizador, editáveis em tempo real e exportáveis em PDF e Word.

## Fluxo do utilizador

```text
1. Galeria de modelos  ->  2. Importar CV antigo (PDF/DOCX)  ->  3. Editor ao vivo  ->  4. Descarregar
   10 modelos já           preenchimento automático             formulário + pré-        PDF (fiel) ou
   preenchidos com         + anexar foto                        visualização lado         Word (.docx
   dados de exemplo                                             a lado                    editável)
```

## O que vai ser construído

**1. Galeria de modelos (página inicial)**
- 10 modelos novos, desenhados de raiz com estética premium (não os do ficheiro enviado, mas inspirados neles): tipografia editorial, colunas laterais coloridas, cabeçalhos com foto circular/recortada, linhas finas, ícones, blocos de competências com barras ou pills.
- Cada cartão mostra o modelo já preenchido com um CV de exemplo moçambicano (nomes, empresas, formações realistas), em miniatura fiel.
- Filtros simples (Clássico / Moderno / Criativo / Executivo) e pré-visualização ampliada antes de escolher.

**2. Importação automática do CV antigo**
- Upload de PDF ou DOCX; o texto é extraído no navegador e enviado para a IA, que devolve os campos estruturados (nome, cargo, contactos, resumo, experiências, formação, competências, idiomas, certificados).
- Barra de progresso e aviso para o utilizador rever o resultado.
- Também é possível começar do zero ou carregar o CV de exemplo.

**3. Foto**
- Upload de imagem com recorte/zoom circular ou quadrado, conforme o modelo; guardada localmente e aplicada de imediato à pré-visualização.

**4. Editor em tempo real**
- Painel esquerdo com secções (Dados pessoais, Resumo, Experiência, Formação, Competências, Idiomas, Certificados, Extras), com adicionar/remover/reordenar itens.
- Pré-visualização à direita atualiza a cada tecla; em telemóvel alterna entre "Editar" e "Ver".
- Personalização: trocar de modelo a qualquer momento sem perder dados, escolher cor de destaque, par tipográfico, densidade/espaçamento e mostrar/ocultar secções.
- Assistente de IA: gerar/melhorar o resumo profissional e reescrever descrições de experiência em linguagem de impacto.
- Guardar automaticamente no navegador (o CV não se perde ao recarregar).

**5. Exportação**
- **PDF**: fiel ao design, A4, alta resolução, sem cortes entre páginas.
- **Word (.docx)**: documento limpo e bem estruturado, fácil de editar (títulos, listas, negritos) — sem tentar copiar o layout gráfico.

**6. Integração no site de vagas**
- A app funciona sem login: os dados ficam no dispositivo do utilizador.
- Rota dedicada em modo "embed" (sem cabeçalho/rodapé) para colocar num `<iframe>` no seu site de vagas, com altura adaptável e cor de destaque configurável por parâmetro de URL.
- Instruções de incorporação numa página própria.

## Sugestões incluídas
- **Medidor de qualidade do CV**: pontuação e dicas (falta resumo, experiência sem datas, poucas competências).
- **Adaptar o CV a uma vaga**: colar a descrição da vaga e a IA sugere palavras-chave e ajusta o resumo.
- **Carta de apresentação** gerada a partir dos mesmos dados (extra opcional).

## Detalhes técnicos
- TanStack Start + React + Tailwind, com sistema de design (tokens) próprio; sem cores fixas nos componentes.
- Extração de texto: `pdfjs-dist` e `mammoth` no navegador.
- IA via Lovable AI Gateway, chamada num server route/server function (chave nunca no cliente).
- PDF: render do nó do CV em alta resolução (`html2canvas` + `jspdf`) com CSS de impressão A4 como alternativa.
- Word: geração `.docx` no cliente com a biblioteca `docx`.
- Estado do CV num store único, persistido em `localStorage`; modelos como componentes que consomem o mesmo esquema de dados, o que permite trocar de modelo sem perder conteúdo.
- Não é necessário backend/base de dados nesta fase (sem contas). Se mais tarde quiser guardar CVs por utilizador no seu site de vagas, acrescenta-se depois.

## Fora do âmbito agora
- Contas de utilizador, pagamentos e histórico de CVs na nuvem.
