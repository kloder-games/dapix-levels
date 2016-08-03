import Vue from 'vue'
import App from './App.vue'

/* eslint-disable no-new */
var vue = new Vue({
    el: 'body',
    components: { App }
});

const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;

const template = [
    {
        label: 'File',
        submenu: [
            { label: 'Opciones...' },
            { type: 'separator' },
            { label: 'Close Tab', accelerator: 'CmdOrCtrl+W' },
            { label: 'Close All Tab' },
            { type: 'separator' },
            { role: 'quit', accelerator: 'CmdOrCtrl+Q' },
        ]
    },{
        label: 'Level',
        submenu: [
            { label: 'New Level', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.newLevel();
            }},
            { label: 'Open Level...', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.openLevel();
            }},
            { type: 'separator' },
            { label: 'Save', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.saveLevel();
            }},
            { label: 'Save as...', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.saveLevelAs();
            }},
            { type: 'separator' },
            { label: 'Export JSON...', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.exportJSONAs();
            } },
            { label: 'Export PNG...', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.exportPNG();
            } },
            { type: 'separator' },
            { label: 'Options...' }
        ]
    },{
        label: 'Tileset',
        submenu: [
            { label: 'New Tileset', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.$refs.tilesetBar.newTileset();
            }},
            { label: 'Open Tileset...', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.$refs.tilesetBar.openTileset();
            }},
            { type: 'separator' },
            { label: 'Save', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.$refs.tilesetBar.saveTileset();
            }},
            { label: 'Save as...', click(item, focusedWindow) {
                if (focusedWindow) vue.$refs.app.$refs.tilesetBar.saveTilesetAs();
            }}
        ]
    },{
        label: 'View',
        submenu: [
            { label: 'Toggle Grid', accelerator: 'CmdOrCtrl+G', click(item, focusedWindow) {
                if (focusedWindow) {
                    vue.$broadcast('toggle-grid');
                }
            }},
            { type: 'separator' },
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.reload();
                }
            },
            { role: 'togglefullscreen' },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools();
                }
            }
        ]
    },{
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo', accelerator: 'CmdOrCtrl+Y' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { type: 'separator' },
            { role: 'delete', accelerator: 'Supr' },
        ]
    },{
        label: 'Selection',
        submenu: [
            { role: 'selectall' },
            { label: 'Invert' },
        ]
    },{
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { require('electron').shell.openExternal('http://electron.atom.io'); }
            },
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
