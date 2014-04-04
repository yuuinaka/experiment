(function(d){

    var fps = 60;
    var depth = 100; // 1 - 100
    
    var canvas = d.getElementById("c1");
    var ctx = canvas.getContext("2d");
    
    // var flg = false;
    var px = 0;
    var py = 0;
    
    function circle(x, y, r, rgba) {
		ctx.fillStyle = "rgba("+ rgba.r +", "+ rgba.g +", "+ rgba.b +", "+ rgba.a +")";
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2, false);
		ctx.fill();
    }

    function fade(px, py, pr, pcolor) {
    	
        var i = 0;
		var x = px;
    	var y = py;
		var r = pr;
        var rgba = pcolor;
        
        var iv = setInterval(function(){
            circle(x , y, r * (i/depth), rgba);	
            if (i == depth) clearInterval(iv);
            i++;
        }, 10);
    
    }

    d.body.addEventListener('click', function(e){
    	
        var px = e.clientX;
        var py = e.clientY;
        var pr = d.body.clientWidth;
        var pcolor = {
            r: 256,
            g: 256,
            b: 256,
            a: 1 / depth
        }
        
        fade(px, py, pr, pcolor);
        
    });
    
/*
    d.body.addEventListener('mousemove', function(e){
    	px = e.clientX;
		py = e.clientY;
		flg = true;
    });
*/
    
    var lp = setInterval(function(){
        
		var px = Math.floor(Math.random() * d.body.clientWidth);
        var py = Math.floor(Math.random() * d.body.clientHeight);
        var pr = Math.floor(Math.random() * 50);
        var pcolor = {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255),
            a: 1 / depth
        }
        
        fade(px, py, pr, pcolor);
        
        //if (flg) fade(px, py);
		// document.getElementById("debug").innerHTML = px;
        
    }, 1000/fps);
    
})(document);
