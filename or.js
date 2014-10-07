var canvas = document.getElementById("canvas");
var p = new Processing(canvas, function(processing) {
  processing.height = 500;
  processing.width = 500;
  var font = processing.loadFont("Courier New");
  processing.textFont(font, 24);

  //Configuration:
  //----------------
  
  // 12345678
  // /```\___
  // __/```\_
  function a_x(t) { t = t % 8; return t<1 ? 0.5-0.5*Math.cos(Math.PI*t) : t<4 ? 1 : t<5 ? 0.5+0.5*Math.cos(Math.PI*t) : 0; }
  function b_x(t) { t = t % 8; return t<2 ? 0 : t<3 ? 0.5-0.5*Math.cos(Math.PI*t) : t<6 ? 1 : t<7 ? 0.5+0.5*Math.cos(Math.PI*t) : 0; }
  
  var center = 120;  
  var input_spacing = 100;
  var in_link_length = 80;
  var out_link_length = 28;
  var stroke = 45;
      
  /*var in_link_length = 54.85;
  var out_link_length = 20;
  var stroke = 45;*/


  var a = new Bar({ origin:{x:100,y:center - input_spacing/2}, length:100, angle:0, stroke:processing.color(255,0,0)});
  var b = new Bar({ origin:{x:100,y:center + input_spacing/2}, length:100, angle:0, stroke:processing.color(150,0,0)});
  var a_link = new Bar({ length:in_link_length, stroke:processing.color(0,255,0)});
  var b_link = new Bar({ length:in_link_length, stroke:processing.color(0,255,0)});
  var o_link = new Bar({ length:out_link_length, stroke:processing.color(0,150,150)});
  var o = new Bar({ length:200, stroke:processing.color(0,0,255)});
  
  var t=0, outputs=[];
  processing.draw = function() {
    t += 0.01;
    if (t>=8) {
      t = 0;
      outputs=[];
    }
    
    //Move the input beams
    a.origin.x = 50+stroke*a_x(t);
    b.origin.x = 50+stroke*b_x(t);
    
    //Move the input links
    a_link.origin = a.end();
    b_link.origin = b.end();
    a_link.joinEnds(b_link, true);
    
    //Move the output link
    o_link.origin = a_link.end();
    o_link.setEndY(center, true);
    o.origin = o_link.end();

    //Drawing
    processing.background(224);
    a.draw(processing);
    b.draw(processing);    
    a_link.draw(processing);
    b_link.draw(processing);
    o_link.draw(processing);
    o.draw(processing);
    
    //Record the output position
    outputs.push(o.origin.x);
    
    //Graphing
    processing.stroke(0,0,0);
    processing.line(50,200,50,351);
    processing.line(50,351,450,351);
    processing.stroke(255,0,0);
    for (var i=0;i<t;i+=0.01) processing.point(50 + i*50, 350 - stroke*a_x(i));
    processing.stroke(150,0,0);
    for (var i=0;i<t;i+=0.01) processing.point(50 + i*50, 350 - stroke*b_x(i));
    processing.stroke(0,0,255);
    for (var n=0;n<outputs.length;n++) processing.point(50 + n/2, 350 - outputs[n] + outputs[0]);
    
    //Instant values
    processing.fill(0,0,0);
    processing.text("OR GATE Simulation", 40,30);
    processing.fill(255,0,0);
    processing.text("A: " + Math.round( stroke*a_x(t) ), 40, 375);
    processing.fill(150,0,0);
    processing.text("B: " + Math.round( stroke*b_x(t) ), 40, 400);
    processing.fill(0,0,255);
    processing.text("O: " + Math.round( o.origin.x - outputs[0] ), 40, 425);
  };
});

