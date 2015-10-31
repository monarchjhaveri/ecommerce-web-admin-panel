var React = require("react");
var Product = require ("./.././Product.jsx");

var ProductsView = React.createClass({
   render: function() {
       return (
           <div>
               <Product />
               <Product />
           </div>
       )
   }
});

module.exports = ProductsView;