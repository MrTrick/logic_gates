/**
 * Define a bar - having a fixed length, an origin point and an angle.
 *
 * Includes useful geometric tools for constructing linkages
 */
var Bar = function(options) {
   options = options || {};
   this.origin = options.origin || {x:0,y:0}
   this.length = options.length || 100;
   this.angle = options.angle || 0;
   this.fill = options.fill || [255,255,255];
   this.stroke = options.stroke || [255,0,0];
   this.thickness = options.thickness || 15;
   
   /**
    * Get the end coordinates of the bar
    */
   this.end = function() {
     return {
       x: this.origin.x + Math.cos(this.angle) * this.length, 
       y: this.origin.y + Math.sin(this.angle) * this.length
     };
   }.bind(this);
     
   /**
    * Given another bar, find an angle for both bars that allows the ends to be joined.
    * Note that this does not permanently imply a join - joinEnds needs to be called each time the bars are moved.
    */
   this.joinEnds = function(bar, anti) {
     //How far apart are the origins?
     var d = Math.sqrt( Math.pow(bar.origin.x - this.origin.x, 2) + Math.pow(bar.origin.y - this.origin.y, 2) );
     var d_angle = Math.atan2( bar.origin.y - this.origin.y ,  bar.origin.x - this.origin.x );
               
     //a2 = b2 + c2 - 2bc cos A ... A = acos( (b2 + c2 - a2) / 2bc )
     var a_angle = Math.acos( (this.length*this.length + d*d - bar.length*bar.length) / (2*this.length*d) );
     var b_angle = Math.acos( (bar.length*bar.length + d*d - this.length*this.length) / (2*bar.length*d) );
       
     if (anti) {
       this.angle = d_angle + a_angle;
       bar.angle = Math.PI + d_angle - b_angle;
     } else {
       this.angle = d_angle - a_angle;
       bar.angle = Math.PI + d_angle + b_angle;
     }
   }.bind(this);
     
   /**
    * Given a Y value, find an angle for the bar that puts the end at that point.
    * Useful for simulating slots etc
    */
   this.setEndY = function(y, anti) {
     this.angle = Math.asin( (y - this.origin.y) / this.length );
     if (anti) this.angle = Math.PI - this.angle;
   }.bind(this);
     
   /**
    * Given an X value, find an angle for the bar that puts the end at that point.
    * Useful for simulating slots etc
    */
   this.setEndX = function(x, anti) {
     this.angle = Math.acos( (x - this.origin.x) / this.length );
     if (anti) this.angle = Math.PI - this.angle;
   }.bind(this);
          
   /**
    * Draw the bar on the Processing screen.
    */
   this.draw = function(processing) {
     processing.fill(this.fill);
     processing.stroke(this.stroke);
     var end = this.end();
     var cos45 = Math.cos(this.angle + Math.PI/4), 
         sin45 = Math.sin(this.angle + Math.PI/4);
     processing.quad(
       this.origin.x - cos45 * this.thickness,
       this.origin.y - sin45 * this.thickness,
       this.origin.x - sin45 * this.thickness,
       this.origin.y + cos45 * this.thickness,
       end.x + cos45 * this.thickness,
       end.y + sin45 * this.thickness,
       end.x + sin45 * this.thickness,
       end.y - cos45 * this.thickness
     );
     processing.line(
       this.origin.x, 
       this.origin.y, 
       end.x,
       end.y
     );
   }.bind(this);
};



