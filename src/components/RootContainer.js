const React = require('react');
const { connect } = require('react-redux');

const Root = require('./Root');


const mapStateToProps = (state) => {
  return state;
};

let RootContainer = (props) => {
  return <Root { ...props } />;
};

RootContainer = connect(mapStateToProps)(RootContainer);

module.exports = RootContainer;
