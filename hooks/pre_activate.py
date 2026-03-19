import importlib.util


def get_tasks_module(module):
    tasks_file = module.relative_path("hooks/tasks.py")
    spec = importlib.util.spec_from_file_location("tasks", tasks_file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run(module):
    """Installs MediaBelt to the users AE Scripts directories."""

    get_tasks_module(module).install()
