window.onload =(function() { 

    var width, height, largeHeader, canvas, ctx, balls, target, size, animateHeader = true; 
    var SPEED = 2; 
    var DISTANCE = 100; 
    var MOUSEDISTANCE = 120; 
    var SIZE_NUM = 7;
    // Main 
    initHeader(); 
    addListeners(); 
    initAnimation(); 

    function initHeader() { 
        width = window.innerWidth; 
        height = window.innerHeight; 
        size = width > height ? height : width; 
        target = {x: 0, y: height}; 

        largeHeader = document.getElementById('right-panel'); 
    //    console.log(largeHeader.offsetWidth);
        largeHeader.offsetHeight = height+'px'; 


        canvas = document.getElementById('right-canvas'); 
        // canvas.width = width; 
        // canvas.height = height; 
        canvas.width = largeHeader.offsetWidth; 
        canvas.height = largeHeader.offsetHeight; 
        ctx = canvas.getContext('2d'); 

        // create balls 
        balls = []; 
        for(var x = 0; x < width; x = x + width/SIZE_NUM) { 
            for(var y = 0; y < height; y = y + height/SIZE_NUM) { 
                var bx = x + Math.random()*width/SIZE_NUM; 
                var by = y + Math.random()*height/SIZE_NUM; 
                                var bdx = Math.random()*SPEED - SPEED/2; 
                                var bdy = Math.random()*SPEED - SPEED/2; 
                var b = {x: bx, dx: bdx, y: by, dy: bdy }; 
                balls.push(b); 
            } 
        } 
        console.log("init balls' size="+balls.length); 
        updateConnectBalls();       

    } 

    function initAnimation() { 
        animate(); 
    } 

    // Event handling 
    function addListeners() { 
                if(!('ontouchstart' in window)) { 
            window.addEventListener('mousemove', mouseMove); 
        } 
        window.addEventListener('scroll', scrollCheck); 
        window.addEventListener('resize', resize); 
    } 
        function mouseMove(e) { 
        var posx = 0; 
        var posy = 0; 
        if (e.pageX || e.pageY) { 
            posx = e.pageX; 
            posy = e.pageY; 
        } 
        else if (e.clientX || e.clientY)    { 
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 
        // console.log("window.innerWidth:"+window.innerWidth+" left-panel:"+document.getElementById('left-panel').offsetWidth+" & posx="+posx);
        if(window.innerWidth > 768){
            posx = posx - document.getElementById('left-panel').offsetWidth -40;
        }
        posx = posx > 0 ? posx : -500;
        posx = posx < canvas.width - 10 ? posx : -500;
        posy = posy > 10 ? posy : -500;
        posy = posy < canvas.height - 10 ? posy : -500;


        var p = {x:posx,y:posy}; 
        if(getDistance(target,p) > 10){ 
                if(balls.length < 2){return;} 
                for(var i = 0; i < balls.length - 1;i++) { 
                        balls[i].isShift = false; 
                } 
        } 
        target.x = posx; 
        target.y = posy; 
    } 

    function scrollCheck() { 
        if(document.body.scrollTop > height) {animateHeader = false;} 
        else {animateHeader = true;} 
    } 

    function resize() { 
        width = window.innerWidth; 
        height = window.innerHeight; 
        size = width > height ? height : width; 
        largeHeader.style.height = height+'px';
        canvas.width = largeHeader.offsetWidth; 
        canvas.height = largeHeader.offsetHeight;  
    } 

    function animate() { 
        if(animateHeader) { 
            ctx.clearRect(0,0,width,height); 
                        drawBall(); 
                        drawLine(); 
                        move(); 
                        updateConnectBalls(); 
        } 
        requestAnimationFrame(animate); 
    } 


        function drawBall() { 
                if(balls.length < 2){return;} 
                for(var i = 0 ;i < balls.length;i++){ 
                    ctx.beginPath(); 
            ctx.arc(balls[i].x, balls[i].y, 2, 0, 2 * Math.PI, false); 
            //ctx.fillStyle = 'rgba(156,217,249,0.9)'; 
                        ctx.fillStyle = 'rgba(0,0,0,0.5)'; 
            ctx.fill(); 
                } 
    } 
        function drawLine() { 
                if(balls.length < 2){return;}         
                for(var i = 0 ;i < balls.length;i++){ 
                //        console.log("balls.connectBalls:"+ balls[i].connectBalls); 
                        ctx.beginPath(); 
                        if(balls[i].connectBalls !== undefined){ 
                                if(balls[i].connectBalls.length > 0){                                         
                                        for(var j = 0 ;j < balls[i].connectBalls.length;j++){ 
                                                if(getDistance(balls[i],balls[i].connectBalls[j]) < DISTANCE){ 
                                                //        console.log("draw line"); 
                                                        ctx.moveTo(balls[i].x,balls[i].y); 
                                                        ctx.lineTo(balls[i].connectBalls[j].x,balls[i].connectBalls[j].y);                                                                                                                                                                 
                                                } 
                                        } 
                                        //ctx.fillStyle = 'rgba(26,227,25,0.2)'; 
                                   //ctx.fill();                                         
                                } 
                        }                         
                        if(getDistance(balls[i],target)<MOUSEDISTANCE+1){ 
                                ctx.moveTo(balls[i].x,balls[i].y); 
                                ctx.lineTo(target.x,target.y); 
                        } 
                        ctx.strokeStyle = 'rgba(56,17,49,0.2)';         
                        ctx.stroke(); 
                } 
        } 
        function move() { 
                if(balls.length < 2){return;} 
                for(var i = 0 ;i < balls.length;i++){ 
                        var nextPosition = {x:balls[i].x+balls[i].dx,y:balls[i].y+balls[i].dy}; 
                        if((getDistance(balls[i],target)<MOUSEDISTANCE && getDistance(nextPosition,target)>MOUSEDISTANCE) || balls[i].isShift === true){ 
                                var flagx = 1; 
                                var flagy = 1; 
                                if(target.x > balls[i].x) {flagx = -1;}         
                                if(target.y > balls[i].y) {flagy = -1;}         
                                var tempy = Math.sqrt(Math.pow(MOUSEDISTANCE, 2) - Math.pow(balls[i].x - target.x, 2))*flagy + target.y;         
                                var tempx = balls[i].x; 
                                if(isNaN(tempy)){ 
                                        tempy = balls[i].y;         
                                        tempx = Math.sqrt(Math.pow(MOUSEDISTANCE, 2) - Math.pow(balls[i].y - target.y, 2))*flagx + target.x; 
                                }                                 
                                var shiftPoint = {x:tempx,y:tempy}; 
                                balls[i].shiftPoint = shiftPoint; 
                                balls[i].isShift = true; 
                                shiftBall(balls[i]); 
                        }else{ 
                                if( balls[i].x + balls[i].dx > width){ 
                                        balls[i].x = width; 
                                        balls[i].dx = -balls[i].dx; 
                                }else if(balls[i].x + balls[i].dx < 0){ 
                                        balls[i].x = 0; 
                                        balls[i].dx = -balls[i].dx; 
                                }else{ 
                                        balls[i].x = balls[i].x + balls[i].dx;         
                                } 
                                if( balls[i].y + balls[i].dy > height){ 
                                        balls[i].y = height; 
                                        balls[i].dy = -balls[i].dy; 
                                }else if(balls[i].y + balls[i].dy < 0){ 
                                        balls[i].y = 0; 
                                        balls[i].dy = -balls[i].dy; 
                                }else{ 
                                        balls[i].y = balls[i].y + balls[i].dy;         
                                } 
                        }                         
                } 
        } 
        function shiftBall( ball ){ 
                ball.x = ball.shiftPoint.x + Math.random()*0.5-0.25; 
                ball.y = ball.shiftPoint.y + Math.random()*0.5-0.25;                 
        } 
        
        function updateConnectBalls() { 
                if(balls.length < 2){return;} 
                for(var i = 0; i < balls.length - 1;i++) { 
                        var point = []; 
                        for(var j = i + 1 ;j< balls.length; j++) { 
                                if(getDistance(balls[i],balls[j])<DISTANCE){ 
                                        point.push(balls[j]);         
                                } 
                        } 
                        balls[i].connectBalls = point; 
//                        console.log(balls[i].connectBalls); 
                } 
        } 
        function getDistance(p1, p2) { 
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)); 
    } 
})();