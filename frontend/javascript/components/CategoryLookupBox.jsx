var React = require("react");
var CategoryLookupHelper = require("../helpers/CategoryLookupHelper/CategoryLookupHelper");
var $ = require("jquery");

function _selectBoxFunctionGenerator(self, object) {
    return function() {
        self.setResult(object);
    };
}

var CategoryLookupBox = React.createClass({ displayName: "CategoryLookupBox",
    getInitialState: function() {
      return {
          searchText: null,
          results: [],
          selectedResult: null,
          history: []
      }
    },
    setResult: function(d) {
        this.setState({selectedResult: d});
    },
    doSearch: function() {
        if (this.refs.searchInput && this.refs.searchInput.value) {
            this.setState({searchText: this.refs.searchInput.value});
            var self = this;
            var results = CategoryLookupHelper.findInCategories(this.refs.searchInput.value).slice(0,20).map(function(d) {
               return (
                   <tr className="result clickable" key={d.id} onClick={_selectBoxFunctionGenerator(self, d)}>
                       <td>
                           {d.name}
                       </td>
                   </tr>
               );
            });
            this.setState({results: results});
        } else {
            this.setState({results: []});
        }
    },
    clearSelection: function() {
      this.setState({selectedResult: null});
    },
    useSelectedCategoryId: function() {
        $("input[name=category_path]")[0].value = this.state.selectedResult.id;
    },
    render: function() {
        if (this.state.selectedResult) {
            var rows = [];
            rows.push(
                (<tr key={this.state.selectedResult.id}><td>ID:<br/> {this.state.selectedResult.id}</td></tr>),
                (<tr key={this.state.selectedResult.name}><td>Name:<br/> {this.state.selectedResult.name}</td></tr>),
                (<tr key={this.state.selectedResult.path}><td>Path:<br/> {this.state.selectedResult.path}</td></tr>)
            );
            if (this.state.selectedResult.parent) {
                var parent = this.state.selectedResult.parent;
                rows.push(<tr key={"parent-header"}><th>Parent</th></tr>);
                rows.push(<tr className="clickable parent" key={this.state.selectedResult.parent.name} onClick={_selectBoxFunctionGenerator(this, parent)}><td>{parent.name}</td></tr>);
            }

            var childRows = [];
            if (this.state.selectedResult.children instanceof Array) {
                var children = this.state.selectedResult.children;
                childRows.push(<tr key={"children-header"}><th>Children</th></tr>);
                for (var i = 0; i < children.length; i++) {
                    childRows.push(<tr className="clickable children" key={children[i].id} onClick={_selectBoxFunctionGenerator(this, children[i])}><td>{children[i].name}</td></tr>);
                }
            }
            return (
                <div className="category-lookup-box">
                    <h2>Category Lookup</h2>
                    <div className="btn btn-success" onClick={this.clearSelection}>Back to Search</div><br/>
                    <div className="btn btn-warning" onClick={this.useSelectedCategoryId}>Use This Category ID</div>
                    <table className="table table-hover table-condensed category-result-table">
                        <tbody>
                            {rows}
                            {childRows}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <div className="category-lookup-box">
                    <h2>Category Lookup</h2>
                    <input type="text" placeholder="search" ref="searchInput" onChange={this.doSearch} defaultValue={this.state.searchText}/>
                    <table className="table table-hover table-condensed category-list-table">
                        <tbody>
                            {this.state.results}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
});

module.exports = CategoryLookupBox;