var versions = {
  'vanilla': 'Box2D',
  'kripken': 'Box2D_v2.3.1_min_kripken'
}

var SELECTED_VERSION = versions['vanilla'];

requirejs([
  SELECTED_VERSION,
  'underscore'
], program, function(e) {
  console.log(e);
});

/* Stats:
  - Standard Box2d, PC:     329
  - Standard Box2d, Device: 4913
*/

function program(_Box2D, _) {
  console.log('box2d', typeof window.Box2D, typeof window._);

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var b2World = Box2D.Dynamics.b2World;
  var b2Vec2 = Box2D.Common.Math.b2Vec2;
  var b2BodyDef = Box2D.Dynamics.b2BodyDef;
  var b2Body = Box2D.Dynamics.b2Body;
  var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
  var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
  var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

  var bodies = [];

  var world = new b2World(new b2Vec2(0, 10), true);

  _.each(_.range(20), function(columns) {
    _.each(_.range(12), function(rows) {
      //Circle
      var circleDef = new b2BodyDef();
      circleDef.type = b2Body.b2_dynamicBody;
      circleDef.position.x = 6 + (columns * 0.3);
      circleDef.position.y = -2 + (rows * 1.1);
      var circleBody = world.CreateBody(circleDef);

      bodies.push(circleBody);

      var circleFixDef = new b2FixtureDef();
      circleFixDef.density = 0.2;
      circleFixDef.friction = 0.8;
      circleFixDef.restitution = 0.2;
      circleFixDef.shape = new b2CircleShape(0.2);

      circleBody.CreateFixture(circleFixDef);
    });
  });

  //Floor
  var floorDef = new b2BodyDef();
  floorDef.type = b2Body.b2_staticBody;
  floorDef.position.x = 0;
  floorDef.position.y = 22;
  var floorBody = world.CreateBody(floorDef);

  var floorFixDef = new b2FixtureDef();
  floorFixDef.density = 0.4;
  floorFixDef.friction = 0.8;
  floorFixDef.restitution = 0.2;
  floorFixDef.shape = new b2PolygonShape();
  floorFixDef.shape.SetAsBox(100, 10);

  floorBody.CreateFixture(floorFixDef);

  context.font = "30px Arial";

  var counter = 0;
  var accumulator = 0;

  function format(input) {
    return Math.round((input) * 10) / 10;
  }

  function gameLoop() {
    var loopStart = performance.now();
    world.Step(1.0/60, 4, 4);
    
    context.fillStyle = '#442222';
    context.fillRect(0, 0, 800, 600);

    for (var i = 0; i < bodies.length; i++) {
      context.fillStyle = '#888888';
      
      var pos = bodies[i].GetPosition();
      context.fillRect(pos.x * 45, pos.y * 45, 10, 10);
    }
    var pos = floorBody.GetPosition();
    context.fillStyle = '#cccccc';
    context.fillRect(pos.x * 45, (pos.y - 10) * 45, 1000, 100);

    context.fillStyle = '#FFFFFF';
    var diff = performance.now() - loopStart;
    context.fillText(format(diff), 700, 100);

    if (counter === 100) {
      context.fillStyle = '#FFFFFF';
      context.fillText(format(accumulator), 700, 200);
    } else {
      counter++;
      accumulator = accumulator + diff;
    }

    window.requestAnimationFrame(gameLoop)
  }
  
  gameLoop();
}