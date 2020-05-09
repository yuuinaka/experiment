let s:comment_string = '//TODO '

function! g:ToggleComment()
    let l:i = indent('.')
    let l:line = getline('.')
    let l:cur_row = getcurpos()[1]
    let l:cur_col = getcurpos()[2]
    let l:prefix = l:i > 0 ? l:line[:l:i - 1] : ''
    if l:line[l:i:l:i + len(s:comment_string) - 1] == s:comment_string
        call setline('.', l:prefix . l:line[l:i + len(s:comment_string):])
        let l:cur_offset = -len(s:comment_string)
    else
        call setline('.', l:prefix . s:comment_string . l:line[l:i:])
        let l:cur_offset = len(s:comment_string)
    endif
    call cursor(l:cur_row, l:cur_col + l:cur_offset)
endfunction

nnoremap gc :call g:ToggleComment()<cr>
