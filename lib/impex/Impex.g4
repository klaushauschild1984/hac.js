grammar Impex;

impex
    : impex_block+
    ;

impex_block
    : comment*
      header
      comment*
      (
        data
        comment*
      )+
    ;

comment
    : '#' ANYTHING NEWLINE
    ;

header
    : KEYWORD IDENTIFIER ( ';' column )+ NEWLINE
    ;
column
    : IDENTIFIER modifyer_list*
    ;
modifyer_list
    : '[' modifyer ( ',' modifyer )* ']'
    ;
modifyer
    : IDENTIFIER '=' ANYTHING
    ;

data
    : cell+ NEWLINE
    ;
cell
    : ';' (~(';'))*?
    ;

LETTER
    : [a-zA-Z]
    ;
NUMBER
    : [0-9]
    ;
SPECIAL
    : [-_]
    ;
IDENTIFIER
    : (LETTER | NUMBER | SPECIAL)+
    ;
KEYWORD
    : 'INSERT'
    | 'UPDATE'
    | 'INSERT_UPDATE'
    | 'REMOVE'
    ;

ANYTHING
    : (~(']' | '['))+?
    ;

NEWLINE
  : '\r'? '\n' -> channel(HIDDEN)
  ;

WHITESPACE
  : [ \t\f]+ -> skip
  ;