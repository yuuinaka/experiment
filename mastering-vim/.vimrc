syntax on
filetype plugin indent on
set autoindent
set expandtab
set tabstop=4
set shiftwidth=4
set backspace=2
colorscheme murphy

set noswapfile

set undofile
if !isdirectory(expand("$HOME/.vim/undodir"))
    call mkdir(expand("$HOME/.vim/undodir"), "p")
endif
set undodir=$HOME/.vim/undodir

packloadall
silent! helptags ALL

noremap <c-h> <c-w><c-h>
noremap <c-j> <c-w><c-j>
noremap <c-k> <c-w><c-k>
noremap <c-l> <c-w><c-l>

set foldmethod=indent

autocmd BufRead * normal zR

set wildmenu
set wildmode=list:longest,full

set number

set hlsearch

set laststatus=2
set showcmd

"alt ESC
inoremap <silent> jj <ESC>
inoremap <silent> kk <ESC>

set clipboard=unnamed,autoselect

