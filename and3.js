var canvas = document.getElementById("canvas");
var p = new Processing(canvas, function(processing) {
  processing.height = 500;
  processing.width = 1000;
  var font = processing.loadFont("Courier New");
  processing.textFont(font, 24);

  //Configuration:
  //----------------
  
  //            0123456789ABCDEF
  var a_data = '_^```v___^```v__';
  var b_data = '___^```````v____';
  var c_data = '_______^```````v';
  function wave(data,t) { 
    var it=Math.floor(t),
        c = data.charAt(it % data.length); 
    return (c=='_') ? 0 : 
           (c=='`') ? 1 :
           (c=='^') ? (0.5-0.5*Math.cos(Math.PI*(t-it))) :
           (c=='v')? (0.5+0.5*Math.cos(Math.PI*(t-it))) : Math.NaN; 
  };
  var a_x = wave.bind(null,a_data);
  var b_x = wave.bind(null,b_data);
  var c_x = wave.bind(null,c_data);
//  function a_x(t) { t = t % 8; return t<1 ? 0.5-0.5*Math.cos(Math.PI*t) : t<4 ? 1 : t<5 ? 0.5+0.5*Math.cos(Math.PI*t) : 0; }
//  function b_x(t) { t = t % 8; return t<2 ? 0 : t<3 ? 0.5-0.5*Math.cos(Math.PI*t) : t<6 ? 1 : t<7 ? 0.5+0.5*Math.cos(Math.PI*t) : 0; }

  
  var center = 150;
  var input_spacing = 100;
  var in_link_length = 80;
  var out_link_length = 28;
  var stroke = 45;
  
  var color_a = processing.color(255,0,0),
      color_b = processing.color(180,0,0),
      color_c = processing.color(110,0,0),
      color_in_link = processing.color(0,255,0),
      color_out_link = processing.color(0,150,150),
      color_o = processing.color(0,0,255);

  var a_bar = new Bar({ origin:{x:100,y:center - input_spacing}, length:100, angle:0, stroke:color_a});
  var b_bar = new Bar({ origin:{x:100,y:center}, length:100, angle:0, stroke:color_b});
  var c_bar = new Bar({ origin:{x:100,y:center + input_spacing}, length:100, angle:0, stroke:color_c});  
  var ab_link = new Bar({ length:in_link_length, stroke:color_in_link});
  var ba_link = new Bar({ length:in_link_length, stroke:color_in_link});
  var bc_link = new Bar({ length:in_link_length, stroke:color_in_link});
  var cb_link = new Bar({ length:in_link_length, stroke:color_in_link});
  var abo_link = new Bar({ length:out_link_length, stroke:color_out_link});
  var bco_link = new Bar({ length:out_link_length, stroke:color_out_link});
  var m1_link = new Bar({ length:in_link_length, stroke:color_in_link});
  var m2_link = new Bar({ length:in_link_length, stroke:color_in_link});
  var o_link = new Bar({ length:out_link_length, stroke:color_out_link});
  var o_bar = new Bar({ length:100, stroke:color_o});
  
  var links = [a_bar,b_bar,c_bar,ab_link,ba_link,bc_link,cb_link,abo_link,bco_link,m1_link,m2_link,o_link,o_bar];
  
  var t=0, o_offset = null;
  processing.background(224);
  processing.draw = function() {
    t += 0.02;
    if (t>=16) {
      t = 0;
      processing.background(224);
    }
    
    //Move the input beams
    a_bar.origin.x = 50+stroke*a_x(t);
    b_bar.origin.x = 50+stroke*b_x(t);
    c_bar.origin.x = 50+stroke*c_x(t);
    
    //Move the input links
    ab_link.origin = a_bar.end();
    ba_link.origin = b_bar.end();
    bc_link.origin = b_bar.end();
    cb_link.origin = c_bar.end();
    ab_link.joinEnds(ba_link);
    bc_link.joinEnds(cb_link);
        
    //Move the first output links
    abo_link.origin = ab_link.end();
    bco_link.origin = bc_link.end();
    abo_link.setEndY(center - input_spacing/2);
    bco_link.setEndY(center + input_spacing/2);
    
    //Move the second input links
    m1_link.origin = abo_link.end();
    m2_link.origin = bco_link.end();
    m1_link.joinEnds(m2_link);
    
    //Move the second output links
    o_link.origin = m1_link.end();
    o_link.setEndY(center);
    o_bar.origin = o_link.end();
    if (!o_offset) o_offset = o_bar.origin.x;

    //Drawing
    processing.stroke(224);
    processing.fill(224);
    processing.rect(30,0,1000,300);
    //processing.background(224);
    links.forEach(function(link) { link.draw(processing); });
    
    //Instant values
    processing.fill(0,0,0);
    processing.text("3-Input AND GATE Simulation", 40,30);
    processing.fill(color_a);
    processing.text("A: " + Math.round( stroke*a_x(t) ), 540, 45);
    processing.fill(color_b);
    processing.text("B: " + Math.round( stroke*b_x(t) ), 540, 70);
    processing.fill(color_c);
    processing.text("C: " + Math.round( stroke*c_x(t) ), 540, 95);
    processing.fill(color_o);
    processing.text("O: " + Math.round( o_bar.origin.x - o_offset ), 540, 120);

    //Graphing
    processing.stroke(0,0,0);
    processing.line(50,300,50,455);
    processing.line(50,455,950,455);
    processing.stroke(color_a);
    processing.point(50 + t*50, 450 - stroke*a_x(t));
    processing.stroke(color_b);
    processing.point(50 + t*50, 450 - stroke*b_x(t));
    processing.stroke(color_c);
    processing.point(50 + t*50, 450 - stroke*c_x(t));    
    processing.stroke(color_o);
    processing.point(50 + t*50, 450 - (o_bar.origin.x - o_offset));
    
  };
});

