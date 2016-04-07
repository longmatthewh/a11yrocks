Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "        <li class=\"chart-color\" style=\"background-color:"
    + alias2(alias1((depth0 != null ? depth0.color : depth0), depth0))
    + "\">\n            <h3><span class=\"offscreen\">foreground colors for</span> "
    + alias2(alias1((depth0 != null ? depth0.color : depth0), depth0))
    + "</h3>\n"
    + ((stack1 = this.invokePartial(partials.paletteFgColors,depth0,{"name":"paletteFgColors","data":data,"indent":"            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "        </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul id=\"color-chart\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.colors : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"usePartial":true,"useData":true})