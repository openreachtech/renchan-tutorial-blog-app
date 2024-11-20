#!/bin/bash

############################################################## declare functions

function jestCommand () {
  npx jest --forceExit --detectOpenHandles --passWithNoTests "$@";
}

function testWithEmpty () {
  blockTitle 'test with master seeds only.';

  jestCommand tests/empty/__tests__/
  jestCommand tests/empty/_orders/

  return
}

function testWithSeeded () {
  blockTitle 'test with master and development seeds.';

  jestCommand tests/__tests__/
  jestCommand tests/_orders/

  return
}

function blockTitle () {
  echo '';
  echo '////////////////////////////////////////////////////////////////////////////////';
  echo '//';
  echo "//    $1";
  echo '//';
  echo '////////////////////////////////////////////////////////////////////////////////';
  echo '';
}

function initialize () {
  blockTitle 'Start to test 🎉';
  date;
}

function terminalize () {
  blockTitle 'Finish to test 🍵';
  date;
}

################################################################### execute main

initialize;

if [ $# = 0 ]; then
  testWithEmpty;
  testWithSeeded;

  exit;
fi

mode="${1:-all}";
target=$2;

if [ $mode = '--empty' ]; then
  if [ "$target" = '' ]; then
    testWithEmpty;
  else
    jestCommand ${@:2};
  fi

  exit;
fi

if [ $mode = '--seeded' ]; then
  if [ "$target" = '' ]; then
    testWithSeeded;
  else
    jestCommand ${@:2};
  fi

  exit;
fi

jestCommand "$@";
