//
// _cv_lib.js
//
// JS bridge and functions for the native event app
// requires jQuery, Cordova

var _cv_lib_val = [];
_cv_version_js = '04.06.2018 Concise AH';
_cv_version_native = '4.0.19';

_cv_lib_val.sharedfolder = '.app';
_cv_lib_val.max_concurrent = 15; //maximum concurrent downloads
_cv_lib_val.timeout = 3000; //timeout reading config file
_cv_lib_val.downloadfiles = false;

function _cv_remote(url) {
  if (typeof (_cv_skip_cordova) == 'undefined') {
    return (url.replace(/[?]/g, "_"));
  } else {
    return (url);
  }
}

//return absolute url to server, async
function _cv_get_server_url(func) {
  if (!_cv_lib_val.app_url) {
    cordova.exec(function (rtn) {
      _cv_lib_val.app_url = rtn.app_url;
      if (_cv_lib_val.app_url[_cv_lib_val.app_url.length - 1] != '/') {
        _cv_lib_val.app_url += '/';
      }
      if (func) {
        func(_cv_lib_val.app_url);
      }
    }, _cv_fail, 'CustomAPI', 'readSettingsFile', []);
  } else if (func) {
    func(_cv_lib_val.app_url);
  }
}

//returns SSID, IP, BSSID (MAC Addr)
function _cv_get_network_info(func) {
  cordova.exec(function (rtn) {
    func(rtn);
  }, _cv_fail, "CustomAPI", "NetworkInfo", []);
}

//returns App Info
function _cv_get_app_info(func) {
  cordova.exec(function (rtn) {
    func(rtn);
  }, _cv_fail, "CustomAPI", "AppInfo", []);
}

//returns App Data
function _cv_get_app_data(func) {
  cordova.exec(function (rtn) {
    func(rtn);
  }, _cv_fail, "CustomAPI", "AppData", []);
}

//returns iOS version, model, platform, cordova version
function _cv_get_device_info(func) {
  cordova.exec(function (rtn) {
    func(rtn);
  }, _cv_fail, "Device", "getDeviceInfo", []);
}

//returns brightness, volume, battery level
function _cv_get_device_data(func) {
  cordova.exec(function (rtn) {
    func(rtn);
  }, _cv_fail, "CustomAPI", "DeviceData", []);
}

//returns Notifications Info
function _cv_get_notification_info(func) {
  cordova.exec(function (rtn) {
    if (!rtn.NotificationEnabled) {
      rtn.NotificationEnabled = false;
    }
    func(rtn);
  }, _cv_fail, "CustomAPI", "NotificationInfo", []);
}

//returns settings file content
function _cv_read_settings(func) {
  cordova.exec(function (rtn) {
    func(rtn);
  }, _cv_fail, "CustomAPI", "readSettingsFile", []);
}

//returns settings file content
function _cv_write_settings(data, func) {
  cordova.exec(function (rtn) {
    func(rtn);
  }, _cv_fail, "CustomAPI", "writeSettingsFile", [data]);
}

//set device volume
function _cv_set_volume(lvl) {
  cordova.exec(false, _cv_fail, "CustomAPI", "setVolume", [lvl]);
}

//set device brightness
function _cv_set_brightness(lvl) {
  cordova.exec(false, _cv_fail, "CustomAPI", "setBrightness", [lvl]);
}

//determine OS version
function _cv_get_os_version() {
  ua = navigator.userAgent;
  if (ua.match(/NativeApp/i)) {
    userOS = 'NativeApp/iOS';
    userOSver = ua.substr(14);
  } else {
    if (ua.match(/iPad/i) || ua.match(/iPhone/i)) {
      userOS = 'iOS';
      uaindex = ua.indexOf('OS ');
    } else if (ua.match(/Android/i)) {
      userOS = 'Android';
      uaindex = ua.indexOf('Android ');
    } else {
      userOS = 'unknown';
    }
    if (userOS == 'iOS' && uaindex > -1) {
      userOSver = ua.substr(uaindex + 3, 3).replace('_', '.');
    } else if (userOS == 'Android' && uaindex > -1) {
      userOSver = ua.substr(uaindex + 8, 3);
    } else {
      userOSver = 'unknown';
    }
  }
  return ({
    'OS': userOS,
    'version': userOSver
  });
}

//scan bluetooth services
function _cv_start_bluetooth_scan(options) {
  if (!options) {
    options = {};
  }
  if (!options.UUID) {
    options.UUID = false;
  }
  cordova.exec(false, _cv_fail, "CustomAPI", "startBluetoothScan", [options.UUID]);
}
//stop beacon scan
function _cv_stop_bluetooth_scan(options) {
  cordova.exec(false, _cv_fail, "CustomAPI", "stopBluetoothScan", []);
}

//start beacon scan
function _cv_start_beacon_scan(options) {
  if (!options) {
    options = {};
  }
  if (!options.UUID) {
    options.UUID = '42122F41-17DE-46A6-A4C7-A392BD8D1F49';
  }
  cordova.exec(false, _cv_fail, "CustomAPI", "startBeaconScan", [options.UUID]);
}
//stop beacon scan
function _cv_stop_beacon_scan(options) {
  if (!options) {
    options = {};
  }
  if (!options.UUID) {
    options.UUID = '42122F41-17DE-46A6-A4C7-A392BD8D1F49';
  }
  cordova.exec(false, _cv_fail, "CustomAPI", "stopBeaconScan", [options.UUID]);
}

//start beacon transmitting
function _cv_start_beacon_transmit(options) {
  if (!options) {
    options = {};
  }
  if (!options.UUID) {
    options.UUID = '42122F41-17DE-46A6-A4C7-A392BD8D1F49';
  }
  if (!options.major) {
    options.major = 1;
  }
  if (!options.minor) {
    options.minor = 1;
  }
  if (!options.name) {
    options.name = '';
  }
  if (!options.message) {
    options.message = '';
  }
  cordova.exec(false, _cv_fail, "CustomAPI", "startBeaconTransmit", [options.UUID, options.major, options.minor, options.name, options.message]);
}
//stop beacon transmitting
function _cv_stop_beacon_transmit() {
  cordova.exec(false, _cv_fail, "CustomAPI", "stopBeaconTransmit", []);
}


//enable device sleep mode
function _cv_enable_sleep(delay) {
  if (!delay) {
    delay = 0;
  }
  cordova.exec(false, _cv_fail, "CustomAPI", "enableSleep", [delay]);
}
//disable device sleep mode
function _cv_disable_sleep() {
  cordova.exec(false, _cv_fail, "CustomAPI", "disableSleep", []);
}
//clear webview history
function _cv_clear_history() {
  cordova.exec(false, _cv_fail, "CustomAPI", "clearHistory", []);
}

//quit app with a 2 second delay
function _cv_quit_app() {
  cordova.exec(false, false, "CustomAPI", "quitApp", []);
}

//suspend app
function _cv_suspend_app() {
  cordova.exec(false, false, "CustomAPI", "suspendApp", []);
}

//set status bar
function _cv_set_status_bar(options) {
  if (!options) {
    options = {};
  }
  if (!options.enabled) {
    options.enabled = false;
  }
  if (!options.animation) {
    options.animation = false;
  }
  if (!options.light) {
    options.light = false;
  }
  console.log(options);
  cordova.exec(false, _cv_fail, "CustomAPI", "setStatusBar", [options.enabled, options.light, options.animation]);
}

//load global variable from file, async
function _cv_get_json(name, func) {
  _cv_get_filesystem(function (fileSystem) {
    fileSystem.root.getDirectory(_cv_lib_val.sharedfolder, {
        create: false,
        exclusive: false
      },
      function (dirEntry) {
        dirEntry.getFile('_cv_lib_val_' + name + '.txt', {
          'create': false,
          'exclusive': false
        }, function (fileEntry) {
          fileEntry.file(function (item) {
            var readr = new FileReader();
            readr.onloadend = function (evt) {
              _cv_lib_val[name] = jQuery.parseJSON(evt.target.result);
              if (func) {
                func(_cv_lib_val[name]);
              }
            };
            readr.readAsText(item);
          }, _cv_fail);
        }, function () {
          _cv_lib_val[name] = {};
          _cv_save_json(name);
          if (func) {
            func(_cv_lib_val[name]);
          }
        });
      }, _cv_fail);
  });
}

//save global variable to file, async
function _cv_save_json(name, func) {
  if (_cv_lib_val[name + '__old'] != JSON.stringify(_cv_lib_val[name])) {
    _cv_get_filesystem(function (fileSystem) {
      fileSystem.root.getDirectory(_cv_lib_val.sharedfolder, {
          create: false,
          exclusive: false
        },
        function (dirEntry) {
          var temp = JSON.stringify(_cv_lib_val[name]);
          dirEntry.getFile('_cv_lib_val_' + name + '.txt', {
            'create': true,
            'exclusive': false
          }, function (fileEntry) {
            fileEntry.createWriter(function (writer) {
              writer.write(temp);
            }, _cv_fail);
            _cv_lib_val[name + '__old'] = JSON.stringify(_cv_lib_val[name]);
          }, _cv_fail);
        }, _cv_fail);
    });
  }
}

//return filesystem handle, set global variables for handles, async
function _cv_get_filesystem(func) {
  if (!_cv_lib_val.filesystem) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
      _cv_lib_val.filesystem = fileSystem;
      _cv_lib_val.filepath = fileSystem.root.toURL();
      if (func) {
        func(_cv_lib_val.filesystem);
      }
    }, _cv_fail);
  } else if (func) {
    func(_cv_lib_val.filesystem);
  }
}

//return documents path
function _cv_get_documents_path(func) {
  if (!_cv_lib_val.documentspath) {
    _cv_get_app_info(function (rtn) {
      _cv_lib_val.documentspath = rtn.DocumentsPath;
      if (func) {
        func(_cv_lib_val.documentspath);
      }
    });
  } else if (func) {
    func(_cv_lib_val.documentspath);
  }
}

//return application path
function _cv_get_app_path(func) {
  if (!_cv_lib_val.apppath) {
    _cv_get_app_info(function (rtn) {
      _cv_lib_val.apppath = rtn.AppPath;
      if (func) {
        func(_cv_lib_val.apppath);
      }
    });
  } else if (func) {
    func(_cv_lib_val.apppath);
  }
}

//returns the native app name
function _cv_get_appname() {
  var appn = (cordova.file.applicationDirectory).split('/');
  return (appn[appn.length - 2]);
}

//opens the phonegap start page
function _cv_restart_app() {
  _cv_get_app_path(function (pth) {
    window.location.href = pth + '/www/index.html';
  });
}

//removes the .app folder and restarts the app
function _cv_reset_app() {
  window.localStorage.clear();
  _cv_get_filesystem(function (fileSystem) {
    fileSystem.root.getDirectory(_cv_lib_val.sharedfolder, {
        create: false,
        exclusive: false
      },
      function (fileEntry) {
        fileEntry.removeRecursively(function () {
          cordova.exec(false, _cv_fail, "CustomAPI", "SQLitePluginCloseAll", []);
          _cv_restart_app();
        }, _cv_fail);
      }, _cv_fail);
  });
}

//read status of reset switch in settings
function _cv_get_reset_switch(func) {
  plugins.appPreferences.fetch(function (rtn) {
    if (func) {
      func(rtn);
    }
  }, _cv_fail, 'app_reset');
}
//set status of reset switch in settings
function _cv_set_reset_switch(val) {
  plugins.appPreferences.store(function () {}, _cv_fail, 'app_reset', val);
}

//read status of reset switch in settings
function _cv_get_debug_switch(func) {
  plugins.appPreferences.fetch(function (rtn) {
    if (func) {
      func(rtn);
    }
  }, _cv_fail, 'app_debug');
}
//set status of reset switch in settings
function _cv_set_debug_switch(val) {
  plugins.appPreferences.store(function () {}, _cv_fail, 'app_debug', val);
}

//returns network connection type
function _cv_get_connection_type() {
  return (navigator.connection.type);
}

//get filelist on server (recursive)
function _cv_get_filelist_from_paths(filelist) {
  var d = $.Deferred();
  _cv_get_server_url(function () {
    _cv_get_json('folders', function () {
      _cv_get_json('files', function () {
        file = _cv_lib_val.app_url + 'native/crawl.php?' + parseInt(Math.random() * 9999999);
        $.ajax({
          url: file,
          dataType: 'text',
          type: 'POST',
          timeout: _cv_lib_val.timeout,
          data: {
            data: JSON.stringify(filelist)
          },
          success: function (rtn) {
            if (rtn) {
              rtn = rtn.split('\n');
              var files = {};
              $.each(rtn, function (k, v) {
                v = v.replace(/[\n\r]/g, '');
                if (v) {
                  var fl = v.split('|');
                  files[fl[2].replace(/[?]/g, "_")] = {
                    "sz": parseInt(fl[0]),
                    "ts": parseInt(fl[1])
                  };
                }
              });
              d.resolve(files);
            } else {
              d.resolve(files);
            }
          },
          error: function (error) {
            _cv_debug('error', 'failed to crawl');
            d.reject('failed to crawl');
          }
        });
      });
    });
  });
  return d.promise();
}

//download filelist from server (cache manifest)
function _cv_get_filelist_from_url(file) {
  var d = $.Deferred();
  _cv_get_server_url(function () {
    _cv_get_json('folders', function () {
      _cv_get_json('files', function () {
        _cv_get_filesystem(function () {
          _cv_debug('message', 'filelist: ' + file);
          file = _cv_lib_val.app_url + file + '&' + parseInt(Math.random() * 9999999);
          var files = {};
          $.ajax({
            url: file,
            dataType: 'text',
            timeout: _cv_lib_val.timeout,
            success: function (rtn) {
              if (rtn) {
                rtn = rtn.split('\n');
                $.each(rtn, function (k, v) {
                  v = v.replace(/[\n\r]/g, '');
                  if (v) {
                    var fl = v.split('|');
                    files[fl[2] /*.replace(/[?]/g,"_")*/ ] = {
                      "sz": parseInt(fl[0]),
                      "ts": parseInt(fl[1])
                    };
                  }
                });
                setTimeout(function () {
                  d.resolve(files);
                }, 1);
              } else {
                d.resolve(files);
              }
            },
            error: function (error) {
              _cv_debug('error', 'failed to load');
              d.reject('failed to load');
            }
          });
        });
      });
    });
  });
  return d.promise();
}

//download zip from server and unpack (must contain cachemanifest.txt file)
function _cv_get_filezip_from_url(file) {
  var d = $.Deferred();
  _cv_get_server_url(function () {
    _cv_get_json('folders', function () {
      _cv_get_json('files', function () {
        file = _cv_lib_val.app_url + file;
        _cv_lib_val.deferred_update_filezip = d;
        cordova.exec(function () {}, function (rtn) {
          d.reject(rtn);
        }, "CustomAPI", "downloadZip", [file]);
        if (!_cv_lib_val._cv_filezip_event) {
          _cv_lib_val._cv_filezip_event = $(document).on("_cv_filezip_event", function (e) {
            _cv_filezip_event(e);
          });
          $(document).on("_cv_zip_progress", function (e) {
            _cv_filezip_event(e);
          });
        }
      });
    });
  });
  return d.promise();
}

//handle events from filezip function
function _cv_filezip_event(e) {
  if (_cv_lib_val.deferred_update_filezip) {
    if (e.stage == 'download done' || e.stage == 'download') {
      _cv_lib_val.deferred_update_filezip.notify({
        "stage": e.stage,
        "bytes": e.bytes,
        "bytesTotal": e.bytesTotal
      });
    } else if (e.stage == 'download error') {
      _cv_lib_val.deferred_update_filezip.reject('download error: ' + e.reason);
      _cv_lib_val.deferred_update_filezip = false;
    } else if (e.stage == 'unzip') {
      _cv_lib_val.deferred_update_filezip.notify({
        "stage": e.stage,
        "bytes": e.total - e.loaded,
        "bytesTotal": e.total
      });
    } else if (e.stage == 'unzip done') {
      _cv_lib_val.deferred_update_filezip.notify({
        "stage": e.stage
      });
      _cv_get_filezip_from_url_compare();
    }
  }
}

//compare downloaded files and only move new files, for filezip function
function _cv_get_filezip_from_url_compare() {
  _cv_get_json('folders', function () {
    _cv_get_json('files', function () {
      _cv_get_filesystem(function (fileSystem) {
        $.ajax({
          url: '../../ziptemp/cachemanifest.txt?' + parseInt(Math.random() * 9999999),
          dataType: 'text',
          success: function (rtn) {
            if (rtn) {
              rtn = rtn.split('\n');
              var files = {};
              _cv_lib_val.update_filezip_count = 0;
              $.each(rtn, function (k, v) {
                v = v.replace(/[\n\r]/g, '');
                if (v) {
                  var fl = v.split('|');
                  files[fl[2].replace(/[?]/g, "_")] = {
                    "sz": parseInt(fl[0]),
                    "ts": parseInt(fl[1])
                  };
                  _cv_lib_val.update_filezip_count++;
                }
              });
              _cv_lib_val.update_filezip_todo = _cv_lib_val.update_filezip_count;
              _cv_check_folder('', files, function () {
                $.each(files, function (k, v) {
                  new_file = true;
                  if (_cv_lib_val.files[k]) {
                    if (v.sz == _cv_lib_val.files[k].sz && v.ts == _cv_lib_val.files[k].ts) {
                      new_file = false;
                    }
                    if (_cv_lib_val.files[k].dl != 'done') {
                      new_file = true;
                    }
                    _cv_lib_val.update_filezip_todo--;
                    setTimeout(_cv_get_filezip_from_url_progress, 1);
                  }
                  if (new_file) {
                    fileSystem.root.getDirectory(".app", {
                      create: true,
                      exclusive: false
                    }, function (dirEntry) {
                      fileSystem.root.getFile('ziptemp/' + k, null,
                        function (fileEntry) {
                          fileEntry.moveTo(dirEntry, k,
                            function () {
                              v.dl = 'done';
                              _cv_lib_val.files[k] = v;
                              setTimeout(function () {
                                _cv_save_json('files');
                              }, 1);
                              _cv_lib_val.update_filezip_todo--;
                              setTimeout(_cv_get_filezip_from_url_progress, 1);
                            },
                            function () {
                              _cv_debug('error', 'file copy failed: ' + k);
                            });
                        },
                        function (error) {
                          _cv_debug('error', 'file not ok: ' + 'ziptemp/' + k);
                        });
                    });
                  }
                });
              });
            } else {
              _cv_debug('error', 'empty: cachemanifest.txt');
              d.reject('empty: cachemanifest.txt');
              _cv_lib_val.deferred_update_filezip.deffered.reject('empty: cachemanifest.txt');
            }
          },
          error: function (error) {
            _cv_debug('error', 'failed to read file: cachemanifest.txt');
            _cv_lib_val.deferred_update_filezip.deffered.reject('failed to read file: cachemanifest.txt');
          }
        });

      }, function () {
        _cv_debug('error', 'failed to find folder: ' + folder);
        _cv_lib_val.deferred_update_filezip.deffered.reject('failed to find folder: ' + folder);
      });
    });
  });
}

//update function for filezip function, delete zip temp folder when finished
function _cv_get_filezip_from_url_progress() {
  if (_cv_lib_val.update_filezip_count && _cv_lib_val.update_filezip_todo == 0) {
    _cv_lib_val.update_filezip_count = 0;
    _cv_lib_val.deferred_update_filezip.notify({
      "stage": 'move done'
    });
    setTimeout(function () {
      _cv_lib_val.deferred_update_filezip.resolve();
    }, 1);
    _cv_delete_folder_from_device('ziptemp').then(function (rtn) {});
  } else if (_cv_lib_val.update_filezip_todo) {
    _cv_lib_val.deferred_update_filezip.notify({
      "stage": 'move',
      "files": _cv_lib_val.update_filezip_count - _cv_lib_val.update_filezip_todo,
      "filesTotal": _cv_lib_val.update_filezip_count
    });
  }
}

//get filelist on device (recursive)
function _cv_get_filelist_from_device(folder, crawl) {
  if (!this.deffered) {
    this.deffered = new jQuery.Deferred();
    this.counter = 0;
    this.file_list = [];
    this.folder_list = [];
  }
  this.counter += 1;
  _cv_get_filesystem(function (fileSystem) {
    fileSystem.root.getDirectory(folder, {
      create: false,
      exclusive: false
    }, function (dirEntry) {
      var dir_read = dirEntry.createReader();
      dir_read.readEntries(function (entries) {
        fd = '';
        if (folder.length) {
          fd = '/';
        }
        for (i = 0; i < entries.length; i++) {
          if (entries[i].isDirectory) {
            this.folder_list.push(folder + fd + entries[i].name);
            if (crawl) {
              _cv_get_filelist_from_device(folder + fd + entries[i].name, true);
            }
          } else {
            this.file_list.push(folder + fd + entries[i].name);
          }
        }
        this.counter--;
        if (this.counter == 0) {
          this.deffered.resolve({
            'folders': this.folder_list,
            'files': this.file_list
          });
          this.deffered = false;
        }
      }, _cv_fail);
    }, function () {
      _cv_debug('error', 'failed to crawl folder: ' + folder);
      this.deffered.reject('failed to crawl folder');
    });
  });
  return this.deffered.promise();
}

//get filelist on device (recursive)
function _cv_delete_files_from_device(files) {
  var d = $.Deferred();
  _cv_get_filesystem(function (fileSystem) {
    for (i = 0; i < files.length; i++) {
      var filen = files[i];
      fileSystem.root.getFile(filen, {
          create: false,
          exclusive: false
        }, function (fileEntry) {
          fileEntry.remove();
        },
        function (fileEntry) {
          _cv_debug('error', 'file does not exist: ' + filen);
        });
    }
    d.resolve('done');
  });
  return d.promise();
}

function _cv_delete_folders_from_device(folders) {
  var d = $.Deferred();
  _cv_get_filesystem(function (fileSystem) {
    for (i = 0; i < folders.length; i++) {
      var foldern = folders[i];
      fileSystem.root.getDirectory(foldern, {
          create: false,
          exclusive: false
        }, function (fileEntry) {
          fileEntry.removeRecursively();
        },
        function (fileEntry) {
          _cv_debug('error', 'folder does not exist: ' + foldern);
        });
    }
    d.resolve('done');
  });
  return d.promise();
}

//update files in filelist
function _cv_download_files(list) {
  var d = $.Deferred();
  if (!_cv_lib_val.downloadfiles) {
    _cv_lib_val.downloadfiles = true;
    _cv_lib_val.download_success = {};
    _cv_lib_val.download_fail = {};
    _cv_get_json('folders', function () {
      _cv_get_json('files', function () {
        _cv_get_filesystem(function () {
          _cv_get_server_url(function () {
            _cv_lib_val.folders_count = 0;
            _cv_lib_val.download_count = 0;
            _cv_lib_val.download_error_count = 0;
            _cv_lib_val.files_count = 0;
            _cv_lib_val.files_size = 0;
            _cv_lib_val.files_count_all = 0;
            _cv_lib_val.files_size_all = 0;
            _cv_lib_val.deferred_update_filelist = d;
            _cv_check_folder('', list, _cv_check_files);
          });
        });
      });
    });
    return d.promise();
  } else {
    _cv_debug('error', 'download files: still running');
    d.reject({
      'error': 'function still running'
    });
    return d.promise();
  }
}

//receive filelist, check for changes
function _cv_check_files(ar) {
  $.each(ar, function (k, v) {
    var new_file = true;
    if (_cv_lib_val.files[k]) {
      if (v.sz == _cv_lib_val.files[k].sz && v.ts == _cv_lib_val.files[k].ts) {
        new_file = false;
      }
      if (_cv_lib_val.files[k].dl != 'done') {
        new_file = true;
      }
    }
    if (new_file) {
      v.dl = 'queue';
      _cv_lib_val.files[k] = v;
      _cv_lib_val.files_count++;
      _cv_lib_val.files_size += v.sz;
      _cv_lib_val.files_count_all++;
      _cv_lib_val.files_size_all += v.sz;
      _cv_update_copy_progress();
      _cv_download_pool();
    }
  });
  if (_cv_lib_val.files_count == 0) {
    _cv_lib_val.downloadfiles = false;
    _cv_lib_val.deferred_update_filelist.resolve('no updates');
  }
}

//initiate downloads, handle maximum concurrent downloads
function _cv_download_pool() {
  if (_cv_lib_val.download_count < _cv_lib_val.max_concurrent) {
    $.each(_cv_lib_val.files, function (k, v) {
      if (v.dl == 'queue') {
        _cv_lib_val.files[k].dl = 'copy';
        _cv_lib_val.download_count++;
        setTimeout(function () {
          _cv_download_file(k);
        }, 1);
        if (_cv_lib_val.download_count >= _cv_lib_val.max_concurrent) {
          return false;
        }
      }
    });
  }
}

//download single file, set status of files
function _cv_download_file(file) {
  var flsrc = _cv_lib_val.app_url + file;
  var fldest = encodeURI(_cv_lib_val.filepath + _cv_lib_val.sharedfolder + '/' + file);
  if (flsrc.indexOf('?') > 0) {
    fldest = fldest.replace(/[?]/g, "_");
    flsrc += '&random=' + parseInt(Math.random() * 9999999);
  } else {
    flsrc += '?' + parseInt(Math.random() * 9999999);
  }
  var fileTransfer = new FileTransfer();
  fileTransfer.download(encodeURI(flsrc), fldest,
    function (entry) {
      _cv_lib_val.files_count--;
      _cv_lib_val.files_size -= _cv_lib_val.files[file].sz;
      _cv_lib_val.download_count--;
      _cv_lib_val.files[file].dl = 'done';
      _cv_lib_val.download_success[file] = true;
      _cv_update_copy_progress();
      _cv_download_pool();
    },
    function (error) {
      _cv_debug('error', 'download error: [' + error.code + '] ' + file);
      _cv_lib_val.download_fail[file] = error.code;
      _cv_lib_val.files_count--;
      _cv_lib_val.download_count--;
      _cv_lib_val.download_error_count++;
      _cv_lib_val.files[file].dl = 'error';
      _cv_update_copy_progress();
      _cv_download_pool();
    }, true);
}

//handle copy progress
function _cv_update_copy_progress() {
  _cv_lib_val.deferred_update_filelist.notify({
    "files": _cv_lib_val.files_count_all - _cv_lib_val.files_count,
    "bytes": _cv_lib_val.files_size_all - _cv_lib_val.files_size,
    "filesTotal": _cv_lib_val.files_count_all,
    "bytesTotal": _cv_lib_val.files_size_all
  });
  if (_cv_lib_val.files_count == 0) {
    _cv_save_json('files');
    if (_cv_lib_val.download_error_count) {
      _cv_lib_val.deferred_update_filelist.reject({
        "filesTotal": _cv_lib_val.files_count_all,
        "filesError": _cv_lib_val.download_error_count,
        "listSuccess": _cv_lib_val.download_success,
        "listFail": _cv_lib_val.download_fail
      });
    } else { //give it time to write the json file
      setTimeout(function () {
        _cv_lib_val.deferred_update_filelist.resolve('done');
      }, 500);
    }
    _cv_lib_val.downloadfiles = false;
  }
}

//checking/creating folders, stores state of folders
function _cv_check_folder(path, ar, func) {
  _cv_lib_val._cv_check_folder_delay = 0;
  $.each(ar, function (k, v) {
    var dir = k.split('/');
    var file = dir.pop();
    if (dir.length) {
      folder = dir.join("/");
      if (!_cv_lib_val.folders[folder]) {
        _cv_check_folder_02(dir, 0, '', ar, func);
      }
    }
  });
  if (_cv_lib_val.folders_count == 0 && func) {
    func(ar);
  }
}

//recursive part of checking/creating folders
function _cv_check_folder_02(dir, num, path, ar, func) {
  var folder = path + dir[num];
  if (!_cv_lib_val.folders[folder]) {
    _cv_lib_val.folders[folder] = -1;
    _cv_lib_val.folders_count++;
    _cv_get_filesystem(function (fileSystem) {
      setTimeout(function () {
        fileSystem.root.getDirectory(_cv_lib_val.sharedfolder + '/' + folder, {
            create: true,
            exclusive: false
          }, function () {
            _cv_lib_val.folders_count--;
            _cv_lib_val.folders[folder] = true
            if (_cv_lib_val.folders_count <= 0 && func) {
              func(ar);
              _cv_save_json('folders');
            }
          },
          function (e) {
            if (e.code == 12) {
              _cv_lib_val.folders_count--;
              _cv_lib_val.folders[folder] = true
              if (_cv_lib_val.folders_count <= 0 && func) {
                func(ar);
                _cv_save_json('folders');
              }
            } else {
              _cv_fail_cv_check_folder_02(e);
            }
          });
      }, _cv_lib_val._cv_check_folder_delay);
    });
  }
  if (num < (dir.length - 1)) {
    _cv_check_folder_02(dir, num + 1, path + dir[num] + '/', ar, func);
  }
}

//format filesize
function _cv_format_filesize(size) {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  rtn = (size / Math.pow(1024, i)).toFixed(1) * 1;
  if (i > 1) {
    rtn = ('' + rtn).split('.');
    rtn = rtn[0] + '.' + (rtn[1] ? rtn[1].charAt(0) : 0);
  } else {
    rtn = parseInt(rtn);
  }
  if (size == 0) {
    rtn = '0';
  } else {
    rtn += ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }
  return rtn;
}

function _cv_path_device() {
  var pathArray = window.location.pathname.split('/');
  var path = "";
  for (i = 0; i < pathArray.length - 1; i++) {
    path += "/";
    path += pathArray[i];
  }
  return ('file:/' + path);
}

//open file with inappbrowser
function _cv_open_file(url, parameters) {
  if (!_cv_lib_val.inappbrowser) {
    if (parameters) {
      _cv_lib_val.inappbrowser_parameters = parameters;
    }
    _cv_lib_val.inappbrowser_deferred = $.Deferred();
    var transitionstyle = '';
    if (parameters.transitionstyle) {
      transitionstyle = ',transitionstyle=' + parameters.transitionstyle.toLowerCase();
    }
    _cv_lib_val.inappbrowser = window.open(url, '_blank', 'location=no,toolbar=no,disallowoverscroll=yes,EnableViewportScale=yes,mediaplaybackrequiresuseraction=no,allowinlinemediaplayback=yes' +
      transitionstyle, parameters.viewContent, parameters.viewSettings, parameters.navContent, parameters.navSettings);
    if (!_cv_lib_val.inappbrowser_event) {
      _cv_lib_val.inappbrowser_event = _cv_lib_val.inappbrowser.addEventListener('exit', function () {
        _cv_open_file_event('exit');
      });
      _cv_lib_val.inappbrowser_loadstart = _cv_lib_val.inappbrowser.addEventListener('loadstart', function () {
        _cv_open_file_event('loadstart');
      });
      _cv_lib_val.inappbrowser_loadstop = _cv_lib_val.inappbrowser.addEventListener('loadstop', function () {
        _cv_open_file_event('loadstop');
      });
      _cv_lib_val.inappbrowser_loaderror = _cv_lib_val.inappbrowser.addEventListener('loaderror', function () {
        _cv_open_file_event('loaderror');
      });
      _cv_lib_val.inappbrowser_send = _cv_lib_val.inappbrowser.addEventListener('send', function (rtn) {
        _cv_open_file_event('send', rtn);
      });
    }
    return _cv_lib_val.inappbrowser_deferred.promise();
  } else {
    var d = $.Deferred();
    d.reject({
      'error': 'inappbrowser already open'
    });
    return d.promise();
  }
}

function _cv_open_file_event(event, obj) {
  if (event == 'exit') {
    _cv_lib_val.inappbrowser_deferred.resolve('exit');
    _cv_lib_val.inappbrowser = false;
  } else if (event == 'loaderror') {
    if (_cv_lib_val.inappbrowser_parameters.onLoadErrorClose) {
      setTimeout(function () {
        _cv_lib_val.inappbrowser.close();
      }, 600);
    }
    _cv_lib_val.inappbrowser_deferred.notify('loaderror');
  } else if (event == 'send') {
    _cv_lib_val.inappbrowser_deferred.notify(event, obj.message);
  } else {
    _cv_lib_val.inappbrowser_deferred.notify(event);
  }
}

function _cv_close_file() {
  if (_cv_lib_val.inappbrowser) {
    _cv_lib_val.inappbrowser.close();
  }
}

function _cv_inappbrowser_close() {
  cordova.exec(false, _cv_fail, "CustomAPI", "inAppBrowserClose", []);
}

function _cv_inappbrowser_navview(options) {
  cordova.exec(false, _cv_fail, "CustomAPI", "inAppBrowserNavView", [options]);
}

function _cv_inappbrowser_webview(options) {
  cordova.exec(false, _cv_fail, "CustomAPI", "inAppBrowserWebView", [options]);
}

function _cv_inappbrowser_generatethumbnails(options) {
  cordova.exec(false, _cv_fail, "CustomAPI", "inAppBrowserGenerateThumbnails", [options]);
}

function _cv_inappbrowser_scroll(options) {
  cordova.exec(false, _cv_fail, "CustomAPI", "inAppBrowserScroll", [options]);
}

function _cv_inappbrowser_send(options) {
  cordova.exec(false, _cv_fail, "CustomAPI", "inAppBrowserSend", [options]);
}

//scan barcode
function _cv_scan_barcode() {
  var d = $.Deferred();
  cordova.plugins.barcodeScanner.scan(function (rtn) {
    if (rtn.cancelled) {
      _cv_debug('message', 'scan cancelled');
      d.reject('scan cancelled');
    } else {
      _cv_debug('message', 'format ' + rtn.format + ' barcode ' + rtn.text);
      d.resolve({
        'format': rtn.format,
        'barcode': rtn.text
      });
    }
  }, function (error) {
    _cv_debug('error', 'scan failed: ' + error);
    d.reject('scan failed: ' + error);
  }, {
    showFlipCameraButton: true,
    disableSuccessBeep: false
  });
  return d.promise();
}

//append to text file, base url is shared document folder
function _cv_write_file(file, txt, append) {
  var d = $.Deferred();
  _cv_get_filesystem(function () {
    _cv_lib_val.filesystem.root.getFile(file, {
        "create": true,
        "exclusive": false
      },
      function (fileEntry) {
        fileEntry.createWriter(
          function (writer) {
            if (append) {
              writer.seek(writer.length);
            }
            writer.write(txt);
            _cv_debug('message', 'write to: ' + file);
            d.resolve();
          },
          function (error) {
            _cv_debug('error', 'write to file failed: ' + file + ' ' + JSON.stringify(error));
            d.reject('write to file failed: ' + JSON.stringify(error));
          });
      },
      function (error) {
        _cv_debug('error', 'write to file failed: ' + file + ' ' + JSON.stringify(error));
        d.reject('write to file failed: ' + JSON.stringify(error));
      });
  });
  return d.promise();
}

//take picture, store to shared document folder
function _cv_capture_image(options) {
  var d = $.Deferred();
  if (!options) {
    options = {};
  }
  if (!options.limit) {
    options.limit = 1;
  }
  if (!options.frontCamera) {
    options.frontCamera = 0;
  }
  cordova.exec(function (rtn) {
    files = [];
    $.each(rtn, function (key, value) {
      value['file'] = value['name'];
      files.push(value);
    });
    d.resolve(files);
  }, function (rtn) {
    d.reject(rtn);
  }, "Capture", "captureImage", [options]);
  return d.promise();
}

//capture video, store to shared document folder
function _cv_capture_video(options) {
  var d = $.Deferred();
  if (!options) {
    options = {};
  }
  if (!options.limit) {
    options.limit = 1;
  }
  if (!options.frontCamera) {
    options.frontCamera = 0;
  }
  cordova.exec(function (rtn) {
    d.resolve(rtn);
  }, function (rtn) {
    d.reject(rtn);
  }, "Capture", "captureVideo", [options]);
  return d.promise();
}

//capture screen, store to shared document folder
function _cv_capture_screen() {
  var d = $.Deferred();
  cordova.exec(function (rtn) {
    d.resolve(rtn);
  }, function (rtn) {
    d.reject(rtn);
  }, "CustomAPI", "captureScreen", []);
  return d.promise();
}

//generate thumbnail of pdf page, store to shared document folder
function _cv_pdf_thumbnail(file, options) {
  var d = $.Deferred();
  if (!options) {
    options = {};
  }
  options.file = file;
  cordova.exec(function (rtn) {
    d.resolve(rtn);
  }, function (rtn) {
    d.reject(rtn);
  }, "CustomAPI", "pdfThumbnail", [options]);
  return d.promise();
}

//enable notifications (this will trigger a confirm dialog the first time)
function _cv_notification_start() {
  var d = $.Deferred();
  cordova.exec(function (rtn) {
    d.resolve(rtn);
  }, function (rtn) {
    d.reject(rtn);
  }, "CustomAPI", "notificationStart", []);
  return d.promise();
}

//send a notification to the lock screen 
function _cv_notification_message(message, options) {
  var d = $.Deferred();
  if (!options) {
    options = {};
  }
  options.message = message;
  cordova.exec(function (rtn) {
    d.resolve(rtn);
  }, function (rtn) {
    d.reject(rtn);
  }, "CustomAPI", "notificationMessage", [options]);
  return d.promise();
}

//set app icon badge number
function _cv_notification_badge(numb) {
  var d = $.Deferred();
  options = {};
  options.number = numb;
  cordova.exec(function (rtn) {
    d.resolve(rtn);
  }, function (rtn) {
    d.reject(rtn);
  }, "CustomAPI", "notificationBadgeNumber", [options]);
  return d.promise();
}

//enable notifications (this will trigger a confirm dialog the first time)
function _cv_firebase_request_token() {
  var d = $.Deferred();
  if (_cv_get_os_version().OS == 'Android') {
    cordova.exec(function (rtn) {
      d.resolve(rtn);
    }, function (rtn) {
      d.reject(rtn);
    }, "FCMPlugin", "getToken", []);
    return d.promise();
  } else {
    cordova.exec(function (rtn) {
      d.resolve(rtn);
    }, function (rtn) {
      d.reject(rtn);
    }, "CustomAPI", "fcmRequestToken", []);
    return d.promise();
  }
}

//converts the message json from ios and android to web api format
function _cv_firebase_message_parse(rtn) {
  var val = {};
  var data = {};
  var data_act = false;
  if (_cv_get_os_version().OS == 'NativeApp/iOS') {
    if (rtn.detail.aps) {
      if (rtn.detail.aps.alert) {
        val.notification = rtn.detail.aps.alert;
      }
    }
    for (key in rtn.detail) {
      if (!key.startsWith('gcm.') && key != 'aps') {
        data_act = true;
        data['gcm.notification.' + key] = rtn.detail[key];
      }
    }
    if (data_act) {
      val['data'] = data;
    }
  } else if (_cv_get_os_version().OS == 'Android') {
    val.notification = {};
    for (key in rtn.detail) {
      if (key == 'wasTapped') {} else if (key == 'NotificationTitle') {
        val.notification.title = rtn.detail[key];
      } else if (key == 'NotificationMessage') {
        val.notification.body = rtn.detail[key];
      } else {
        data_act = true;
        data['gcm.notification.' + key] = rtn.detail[key];
      }
    }
    if (data_act) {
      val['data'] = data;
    }
  } else {
    val = rtn;
  }
  return val;
}

function _cv_firebase_token_parse(rtn) {
  var val = {};
  if (rtn.token) {
    val.token = rtn.token;
  }
  if (rtn.message) {
    val.message = _cv_firebase_message_parse({
      'detail': rtn.message
    });
  }
  return val;
}

//start native transition (like page curl)
function _cv_transition(effect, duration, direction) {
  if (!duration) {
    duration = .5;
  }
  nativetransitions.starttrans(effect, duration, direction);
}

//keyboard plugin proxy
function _cv_keyboard_hide_bar(opt) {
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(opt);
}

function _cv_keyboard_disable_scroll(opt) {
  cordova.plugins.Keyboard.disableScroll(opt);
}

function _cv_keyboard_close() {
  cordova.plugins.Keyboard.close();
}

function _cv_keyboard_isvisible() {
  return (cordova.plugins.Keyboard.isVisible);
}

//ntp function
function _cv_query_ntp_offset(options) {
  if (!options) {
    options = {};
  }
  if (!options.server) {
    options.server = 'time.apple.com';
  }
  cordova.exec(false, _cv_fail, "CustomAPI", "queryNTPOffset", [options.server]);
}
//stop ntp
function _cv_stop_ntp_offset() {
  cordova.exec(false, _cv_fail, "CustomAPI", "stopNTPOffset", []);
}

//open url on external display
function _cv_open_secondscreen(url, options) {
  if (!options) {
    options = {};
  }
  if (options.viewContent) {
    cordova.exec(false, _cv_fail, "CustomAPI", "openSecondScreen", [url, options.viewContent]);
  } else {
    cordova.exec(false, _cv_fail, "CustomAPI", "openSecondScreen", [url]);
  }
}
//run javascript in external display
function _cv_executescript_secondscreen(cmd) {
  cordova.exec(false, _cv_fail, "CustomAPI", "executeScriptSecondScreen", [cmd]);
}
//close external display
function _cv_close_secondscreen() {
  cordova.exec(false, _cv_fail, "CustomAPI", "closeSecondScreen", []);
}


//setup udp communication
function _cv_start_udp(options) {
  if (!options) {
    options = {};
  }
  if (!options.port) {
    options.port = 5555;
  }
  if (!options.group) {
    options.group = '226.1.1.1';
  }
  cordova.exec(false, _cv_fail, "CustomAPI", "startUDP", [options.port, options.group]);
}
//stop udp
function _cv_stop_udp() {
  cordova.exec(false, _cv_fail, "CustomAPI", "stopUDP", []);
}
//send udp data to group
function _cv_send_udp(options) {
  if (!options) {
    options = {};
  }
  if (!options.data) {
    options.data = '';
  }
  if (!options.ip) {
    cordova.exec(false, _cv_fail, "CustomAPI", "sendUDPtoGroup", [options.data]);
  } else {
    cordova.exec(false, _cv_fail, "CustomAPI", "sendUDPtoIP", [options.data, options.ip]);
  }
}

//sort associative array
function _cv_sort_assoc(oAssoc) {
  var idx;
  var key;
  var arVal = [];
  var arValKey = [];
  var oRes = {};
  for (key in oAssoc) {
    arVal[arVal.length] = oAssoc[key];
    arValKey[oAssoc[key]] = key;
  }
  arVal.sort(function (a, b) {
    return a - b;
  });
  for (idx in arVal) {
    oRes[arValKey[arVal[idx]]] = arVal[idx];
  }
  return oRes;
}

//generic functions
function _cv_error(txt) {
  _cv_debug('error', txt);
  console.error(txt);
}

function _cv_fail(error) {
  _cv_error("Error: " + error.code);
}

function _cv_fail_cv_check_folder_02(error) {
  console.log(error);
  _cv_error("Error: (_cv_check_folder_02) " + error.code);
}

function _cv_debug(debug, message) {
  $("body").trigger({
    type: "_cv_debug_triggered",
    debug: debug,
    message: message
  });
}