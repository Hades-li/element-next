import Test from './src/test';

/* istanbul ignore next */
Test.install = function(app) {
  app.component(Test.name, Test);
};

export default Test;
