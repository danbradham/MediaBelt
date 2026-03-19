set windows-shell := ["powershell", "-c"]

default:
    @just --list

install:
    py hooks/tasks.py install

uninstall:
    py hooks/tasks.py uninstall

watch:
    watchexec -r -e jsx -- just install
