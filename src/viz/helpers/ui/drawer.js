var copy  = require("../../../util/copy.coffee"),
    form  = require("../../../form/form.js"),
    print = require("../../../core/console/print.coffee")

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Draws a UI drawer, if defined.
//------------------------------------------------------------------------------
module.exports = function( vars ) {

  var enabled = vars.ui.value && vars.ui.value.length
    , position = vars.ui.position.value

  if ( vars.dev.value && enabled ) print.time("drawing custom UI elements")

  var drawer = vars.container.value.selectAll("div#d3plus_drawer")
    .data(["d3plus_drawer"])

  drawer.enter().append("div")
    .attr("id","d3plus_drawer")

  var positionStyles = {}
  vars.ui.position.accepted.forEach(function(p){
    positionStyles[p] = p == position ? vars.margin.bottom+"px" : "auto"
  })

  drawer
    .style("text-align",vars.ui.align.value)
    .style("position","absolute")
    .style("width",vars.width.value-(vars.ui.padding*2)+"px")
    .style("height","auto")
    .style(positionStyles)

  var ui = drawer.selectAll("div.d3plus_drawer_ui")
    .data(enabled ? vars.ui.value : [], function(d){
      return d.method || false
    })

  ui.enter().append("div")
    .attr("class","d3plus_drawer_ui")
    .style("padding",vars.ui.padding+"px")
    .style("display","inline-block")
    .each(function(d){

      var container = d3.select(this)

      d.form = form()
        .container(container)
        .focus(vars[d.method].value,function(value){

          if ( value !== vars[d.method].value ) {
            vars.self[d.method](value).draw()
          }

        })
        .id("id")
        .text("text")
        .type("auto")

    })

  ui.each(function(d){

    var data = []
      , title = vars.format.locale.value.method[d.method] || d.method

    d.value.forEach(function(o){

      var obj = {
        "id": o,
        "text": vars.format.value(o)
      }
      data.push(obj)

    })

    var font = copy(vars.ui.font)
    font.secondary = vars.ui.font

    d.form
      .data(data)
      .font(font)
      .format(vars.format.locale.language)
      .title(vars.format.value(title))
      .ui({
        "align": vars.ui.align.value,
        "padding": vars.ui.padding,
        "margin": 0
      })
      .width(d.width || false)
      .draw()

  })

  ui.exit().remove()

  var drawerHeight = drawer.node().offsetHeight || drawer.node().getBoundingClientRect().height

  if ( drawerHeight ) {
    vars.margin[position] += drawerHeight
  }

  if ( vars.dev.value && enabled ) print.timeEnd("drawing custom UI elements")

}
