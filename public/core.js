// // public/core.js
// var scotchTodo = angular.module('scotchTodo', []);
//
// function mainController($scope, $http) {
//     $scope.formData = {};
//
//     // when landing on the page, get all todos and show them
//     $http.get('/api/todos')
//         .success(function(data) {
//             $scope.todos = data;
//             console.log(data);
//         })
//         .error(function(data) {
//             console.log('Error: ' + data);
//         });
//
//     // when submitting the add form, send the text to the node API
//     $scope.createTodo = function() {
//         $http.post('/api/todos', $scope.formData)
//             .success(function(data) {
//                 $scope.formData = {}; // clear the form so our user is ready to enter another
//                 $scope.todos = data;
//                 console.log(data);
//             })
//             .error(function(data) {
//                 console.log('Error: ' + data);
//             });
//     };
//
//     // delete a todo after checking it
//     $scope.deleteTodo = function(id) {
//         $http.delete('/api/todos/' + id)
//             .success(function(data) {
//                 $scope.todos = data;
//                 console.log(data);
//             })
//             .error(function(data) {
//                 console.log('Error: ' + data);
//             });
//     };
//
// }

var app = angular.module('scotchTodo', []);
app.controller('mainController', [
    '$scope',
    'readFileData',
    function($scope, readFileData) {
      $scope.fileDataObj = {};

    $scope.uploadFile = function() {
      if ($scope.fileContent) {
        $scope.fileDataObj = readFileData.processData($scope.fileContent);

        $scope.fileData = JSON.stringify($scope.fileDataObj);
      }
    }
 }]);
// app.controller('mainController', function($scope) {
//   $scope.title = 'Read CSV file with Angular';
// });

app.directive('fileReaderDirective', function() {
    return {
        restrict: "A",
        scope: {
            fileReaderDirective: "=",
        },
        link: function(scope, element) {
            $(element).on('change', function(changeEvent) {
                var files = changeEvent.target.files;
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        var contents = e.target.result;
                        scope.$apply(function() {
                            scope.fileReaderDirective = contents;
                        });
                    };
                    r.readAsText(files[0]);
                }
            });
        }
    };
});

app.factory('readFileData', function() {
    return {
        processData: function(csv_data) {
            var record = csv_data.split(/\r\n|\n/);
            var headers = record[0].split(',');
            var lines = [];
            var json = [];

            for (var i = 1; i < record.length; i++) {
                var data = record[i].split(',');
                if (data.length == headers.length) {
                    var tarr = {};
                    tarr.x = data[0];
                    tarr.y = data[1];
                    // for (var j = 0; j < headers.length; j++) {
                    //     tarr.push(data[j]);
                    // }
                    json.push(tarr);
                }
            }

            // for (var k = 0; k < lines.length; ++k){
            //   json[k] = lines[k];
            // }
            var jsonArray = JSON.parse(JSON.stringify(json));
            // console.log(typeof(jsonArray));
            return jsonArray;
        }
    };
});
