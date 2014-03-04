/**
 * Created by Andrey Selitsky on 2/27/14.
 */
angular.module('bmb.velvet.ui.folders', ['velvet', 'ui.router'])
    .controller('FoldersCtrl', function ($scope, folders, $state) {
        $scope.model = {};
        $scope.model.folders = folders;

        $scope.backToFolders = function () {
            delete $scope.model.selectedFolder;
            delete $scope.model.documents;
            $state.go('folders')
        };
    })
    .controller('FolderDocumentsCtrl', function ($scope, $stateParams) {
        $scope.model.selectedFolder = _.find($scope.model.folders, function (folder) {
            return folder.Id == $stateParams.folderId;
        });

        $scope.model.selectedFolder.Documents().success(function (documents) {
            $scope.model.documents = documents;
        });
    })
    .provider('responsiveHelper', [function () {
        var injector = angular.injector(['ng']);
        var $window = injector.get('$window');

        var helper = {

            isSmartDevice: function () {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            },

            isMobile: function () {
                var width = $window['outerWidth'];
                var smartDevice = helper.isSmartDevice();
                return width <= 767;
            },

            isTablet: function () {
                var width = $window['outerWidth'];
                var smartDevice = helper.isSmartDevice();
                return smartDevice && width >= 768;
            },

            isDesktop: function () {
                return !helper.isSmartDevice();
            }
        };

        this.$get = function () {
            return helper;
        };
    } ])
    .directive('bmbFolders', function (responsiveHelper) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/folders/templates/' + (responsiveHelper.isMobile() ? 'layout-mobile.html' : 'layout-desktop.html')
        }
    })
    .directive('bmbFoldersList', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/folders/templates/folders-list.html'
        }
    })
    .directive('bmbFoldersDocuments', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/folders/templates/documents.html'
        }
    });