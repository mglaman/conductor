const utils = require('../../utils/misc');
const fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const thisWindow = remote.getCurrentWindow();
const Project = require('../../models/Project');
const Composer = require('../../utils/Composer');

let activeProject = mainProcess.getActiveProject();
let activePackage = null;
let projectInstalled = activeProject.isInstalled();
let composer = new Composer(activeProject.getPath());


const renderDependencies = (elId, dev) => {
    var elDependencies = document.getElementById(elId);

    var projectDependencies = null;
    if (typeof dev === "boolean") {
        projectDependencies = activeProject.getRequireDev();
    } else {
        projectDependencies = activeProject.getRequire();
    }

    for (var key in projectDependencies) {
        if (!projectDependencies.hasOwnProperty(key)) {
            continue;
        }
        var item = document.createElement('li');
        item.setAttribute('data-package', key);
        item.appendChild(document.createTextNode(key));
        elDependencies.appendChild(item);
    }
};
const renderProjectDetails = (project) => {
    thisWindow.setTitle(project.getName());
    let container = document.getElementById('wrapper-contents-container');
    container.innerHTML = fs.readFileSync('src/windows/project/project.html');

    document.getElementById('project-name').textContent = project.getName();
    document.getElementById('project-title').textContent = project.getName();
    document.getElementById('project-description').textContent = project.getDescription();
    if (typeof project.getHomepage() == 'string') {
        document.getElementById('project-url').textContent = project.getHomepage();
    }

    if (project.isInstalled()) {
        document.getElementById('project-composer-lock').classList.remove('hidden');
        document.getElementById('action-composer-update').classList.remove('hidden');
    }

    utils.$onClick('project-name', (e) => {
        renderProjectDetails(activeProject);
    });
    utils.$onClick('project-composer-json', (e) => {
        renderProjectDetails(activeProject);
    });
}

const renderPackageDetails = (packageName) => {
    activePackage = activeProject.getLock().getPackage(packageName);
    let $ = document;
    let container = $.getElementById('wrapper-contents-container');

    viewingPackage = activeProject.getLock().getPackage(packageName);

    container.innerHTML = fs.readFileSync('src/windows/package/package.html');

    $.getElementById('package-name').textContent = activePackage.json.name;
    $.getElementById('package-version').textContent = activePackage.getVersion();
    $.getElementById('package-homepage').textContent = activePackage.json.homepage;
    $.getElementById('package-description').textContent = activePackage.json.description;

    let elOutput = $.getElementById('composer-output');

    utils.$onClick('action-composer-update', (e) => {
        elOutput.innerHTML = '';
        var elIcon = utils.findButtonicon(e.srcElement);
        elIcon.classList.remove('hidden');

        const update = composer.update(activePackage.__get('name'));
        update.on('close', (code) => {
            elIcon.classList.add('hidden');
        });
        update.on('error', (data) => {
            elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
        });
        utils.outputReadLine(update.stdout, 'log--output', elOutput);
        utils.outputReadLine(update.stderr, 'log--output', elOutput);
    });

    utils.$onClick('action-composer-remove', (e) => {
        elOutput.innerHTML = '';
        var elIcon = utils.findButtonicon(e.srcElement);
        elIcon.classList.remove('hidden');

        const remove = composer.remove(activePackage.getName());
        remove.on('close', (code) => {
            elIcon.classList.add('hidden');
        });
        remove.on('error', (data) => {
            elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
        });
        utils.outputReadLine(remove.stdout, 'log--output', elOutput);
        utils.outputReadLine(remove.stderr, 'log--output', elOutput);
    });

    utils.$onClick('action-composer-show', (e) => {
        elOutput.innerHTML = '';
        var elIcon = utils.findButtonicon(e.srcElement);
        elIcon.classList.remove('hidden');

        const show = composer.show(activePackage.getName());
        console.log(show);
        show.on('close', (code) => {
            console.log(code);
            elIcon.classList.add('hidden');
        });
        show.on('error', (data) => {
            console.log(data);
            elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
        });
        utils.outputReadLine(show.stdout, 'log--output', elOutput);
        utils.outputReadLine(show.stderr, 'log--output', elOutput);
    });
}

const renderComposerOutput = () => {
    const elOutput = document.getElementById('composer-output');

    utils.$onClick('action-composer-install', (e) => {
        elOutput.innerHTML = '';
        var elIcon = utils.findButtonicon(e.srcElement);
        elIcon.classList.remove('hidden');

        const install = composer.install();
        install.on('close', (code) => {
            elIcon.classList.add('hidden');

            if (code === 0) {
                activeProject.refreshData();
                projectInstalled = activeProject.isInstalled();
                // @todo get some kind of binding to not need to do this.
                // thisWindow.reload();
            }
        });
        install.on('error', (data) => {
            elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
        });
        utils.outputReadLine(install.stdout, 'log--output', elOutput);
        // General step info gets sent to stderr, so we don't style it as an error.
        utils.outputReadLine(install.stderr, 'log--output', elOutput);
    });

    utils.$onClick('action-composer-update', (e) => {
        elOutput.innerHTML = '';
        var elIcon = utils.findButtonicon(e.srcElement);
        elIcon.classList.remove('hidden');

        const update = composer.update(null);
        update.on('close', (code) => {
            elIcon.classList.add('hidden');
        });
        update.on('error', (data) => {
            elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
        });
        utils.outputReadLine(update.stdout, 'log--output', elOutput);
        utils.outputReadLine(update.stderr, 'log--output', elOutput);
    });


    utils.$onClick('action-composer-validate', (e) => {
        elOutput.innerHTML = '';
        var elIcon = utils.findButtonicon(e.srcElement);
        elIcon.classList.remove('hidden');

        const validate = composer.validate();
        validate.on('close', (code) => {
            elIcon.classList.add('hidden');
        });
        validate.on('error', (data) => {
            elOutput.appendChild(utils.outputLogMessage(data, 'log--error'));
        });
        utils.outputReadLine(validate.stdout, 'log--output', elOutput);
        utils.outputReadLine(validate.stderr, 'log--output', elOutput);
    });
}


renderProjectDetails(activeProject);
renderDependencies('project-dependencies');
renderDependencies('project-dev-dependencies', true);
renderComposerOutput();

document.querySelectorAll('.project__dependencies-list li').forEach(function (e) {
    if (projectInstalled) {
        let packageName = e.getAttribute('data-package');

        if (packageName != 'php' || packageName.indexOf('ext-') > -1) {
            e.addEventListener('click', function (eClick) {
                var packageName = eClick.srcElement.getAttribute('data-package');
                renderPackageDetails(packageName);
            });
        }
    }
});
