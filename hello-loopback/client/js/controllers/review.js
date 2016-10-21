// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('AllReviewsController', ['$scope', 'Review', function($scope,
      Review) {
    $scope.reviews = Review.find({
      filter: {
        include: [
          'pets',
          'reviewer'
        ]
      }
    });
  }])
  .controller('AddReviewController', ['$scope', 'Pets', 'Review',
      '$state', function($scope, Pets, Review, $state) {
    $scope.action = 'Add';
    $scope.coffeeShops = [];
    $scope.selectedShop;
    $scope.review = {};
    $scope.isDisabled = false;

    Pets
      .find()
      .$promise
      .then(function(coffeeShops) {
        $scope.coffeeShops = coffeeShops;
        $scope.selectedShop = $scope.selectedShop || coffeeShops[0];
      });

    $scope.submitForm = function() {
      Review
        .create({
          rating: $scope.review.rating,
          comments: $scope.review.comments,
          coffeeShopId: $scope.selectedShop.id
        })
        .$promise
        .then(function() {
          $state.go('all-reviews');
        });
    };
  }])
  .controller('DeleteReviewController', ['$scope', 'Review', '$state',
      '$stateParams', function($scope, Review, $state, $stateParams) {
    Review
      .deleteById({ id: $stateParams.id })
      .$promise
      .then(function() {
        $state.go('my-reviews');
      });
  }])
  .controller('EditReviewController', ['$scope', '$q', 'Pets', 'Review',
      '$stateParams', '$state', function($scope, $q, Pets, Review,
      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.coffeeShops = [];
    $scope.selectedShop;
    $scope.review = {};
    $scope.isDisabled = true;

    $q
      .all([
        Pets.find().$promise,
        Review.findById({ id: $stateParams.id }).$promise
      ])
      .then(function(data) {
        var coffeeShops = $scope.coffeeShops = data[0];
        $scope.review = data[1];
        $scope.selectedShop;

        var selectedShopIndex = coffeeShops
          .map(function(coffeeShop) {
            return coffeeShop.id;
          })
          .indexOf($scope.review.coffeeShopId);
        $scope.selectedShop = coffeeShops[selectedShopIndex];
      });

    $scope.submitForm = function() {
      $scope.review.coffeeShopId = $scope.selectedShop.id;
      $scope.review
        .$save()
        .then(function(review) {
          $state.go('all-reviews');
        });
    };
  }])
  .controller('MyReviewsController', ['$scope', 'Review',
      function($scope, Review) {
        // after a refresh, the currenUser is not immediately on the scope
        // So, we're watching it on the scope and load my reviews only then.
        $scope.$watch('currentUser.id', function(value) {
          if (!value) {
            return;
          }
          $scope.reviews = Review.find({
            filter: {
              where: {
                publisherId: $scope.currentUser.id
              },
              include: [
                'pets',
                'reviewer'
              ]
            }
          });
        });
  }]);
