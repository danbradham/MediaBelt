import glob
import os
import re
import shutil
import sys

this_name = "MediaBelt"
this_path = os.path.dirname(__file__)


def module_path(*parts):
    return normalize(this_path, *parts)


def valid_platform():
    return sys.platform in ["win32", "darwin"]


def check_platform():
    if not valid_platform():
        print(f"Unsupported platform: {sys.platform}")
        sys.exit(1)


def normalize(*parts):
    return os.path.join(*parts).replace("\\", "/")


def get_adobe_user_directory():
    if sys.platform == "win32":
        path = os.path.expandvars("$APPDATA/Adobe")
    else:
        path = os.path.expanduser("~/Library/Preferences/Adobe")
    return normalize(path)


def list_AE_scripts_directories():
    adobe = get_adobe_user_directory()
    ae_scripts_pattern = adobe + "/After Effects/*/Scripts"
    return [normalize(path) for path in glob.glob(ae_scripts_pattern)]


def get_source_map(source_folder):
    source_map = {}
    for root, subdirs, files in os.walk(source_folder):
        for file in files:
            source_file = normalize(root, file)
            relative_source_file = os.path.relpath(source_file, source_folder)
            source_map[relative_source_file] = source_file
    return source_map


def install():
    """Installs MediaBelt to the users AE Scripts directories."""

    check_platform()

    source_map = get_source_map(module_path("../Scripts"))

    for script_dir in list_AE_scripts_directories():
        for rsrc_file, src_file in source_map.items():
            dst_file = normalize(script_dir, rsrc_file)
            os.makedirs(os.path.dirname(dst_file), exist_ok=True)
            shutil.copy2(src_file, dst_file)


def uninstall():
    """Uninstalls MediaBelt from all of the users AE Scripts directories."""

    check_platform()

    for script_dir in list_AE_scripts_directories():
        for root, subdirs, files in os.walk(script_dir):
            for subdir in list(subdirs):
                if this_name in subdir:
                    subdirs.remove(subdir)
                    shutil.rmtree(normalize(root, subdir))
            for file in files:
                if this_name in file:
                    os.unlink(normalize(root, file))


def version(label):
    version = label.lstrip("v")

    updates = [
        (module_path("../module.yml"), r"version: ([A-Za-z0-9.-]+)$"),
        (module_path("../Scripts/ScriptUI Panels/(MediaBelt)/lib.jsx"), r'version: "([A-Za-z0-9.-]+)",$')
    ]
    for file, regex in updates:
        with open(file, "r", encoding="utf-8") as f:
            contents = f.read()

        match = re.search(regex, contents, re.MULTILINE)
        if not match:
            raise RuntimeError(f"Failed to update version in {file}")

        old_version_string = match.group()
        new_version_string = old_version_string.replace(match.group(1), version)
        new_contents = contents.replace(old_version_string, new_version_string)

        with open(file, "w", encoding="utf-8") as f:
            f.write(new_contents)


if __name__ == "__main__":
    task_name = sys.argv[1] if len(sys.argv) > 1 else None
    if task_name == "install":
        install()
    elif task_name == "uninstall":
        uninstall()
    elif task_name == "version":
        if len(sys.argv) < 3:
            print("Usage: tasks.py version <label>")
            sys.exit(1)
        version(sys.argv[2])
    else:
        print("Usage: tasks.py [install|uninstall]")
