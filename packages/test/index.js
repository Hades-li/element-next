import ElTag from './src/test';

/* istanbul ignore next */
ElTag.install = function(app) {
  app.component(ElTag.name, ElTag);
};

export default ElTag;
