set windows-shell := ["powershell", "-c"]

default:
    @just --list

install:
    py hooks/tasks.py install

uninstall:
    py hooks/tasks.py uninstall

watch:
    watchexec -r -e jsx -- just install

release tag:
    py hooks/tasks.py version {{tag}}
    git add .
    git commit -m "Release {{tag}}"
    git tag --force {{tag}}
    git push
    git push --tags --force

deploy:
    echo Deploying to Brand New School Flow Production Tracking site....
    cpenv publish . --overwrite --to_repo=bns_shotgun
