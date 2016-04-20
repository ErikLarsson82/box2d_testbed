var versions = {
  'vanilla': 'Box2D',
  'kripken': 'Box2D_v2.3.1_min_kripken'
}

var CURRENT_BOX2D_NAME = 'vanilla'; //Change between 'vanilla' and 'kripken' to test the different versions
var box2d_path = versions[CURRENT_BOX2D_NAME];

requirejs([
  box2d_path,
  'underscore'
], program, function(e) {
  console.log(e);
});

/* Stats:
  - Standard Box2d, PC:       329
  - Standard Box2d, Device:   4481

  - Kripken Box2d, PC:        330
  - Kripken Box2d, Device:    5876
*/

function program(_Box2D, _) {
  console.log('box2d', typeof window.Box2D, typeof window._);

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var b2World;
  var b2Vec2;
  var b2BodyDef;
  var b2Body;
  var b2FixtureDef;
  var b2PolygonShape;
  var b2CircleShape;
  var b2RevoluteJointDef;
  var b2EdgeShape;

  if (CURRENT_BOX2D_NAME === 'vanilla') {
    b2World = Box2D.Dynamics.b2World;
    b2Vec2 = Box2D.Common.Math.b2Vec2;
    b2BodyDef = Box2D.Dynamics.b2BodyDef;
    b2Body = Box2D.Dynamics.b2Body;
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
    b2_dynamicBody = b2Body.b2_dynamicBody;
    b2EdgeShape = null;
  } else {
    b2World = Box2D.b2World;
    b2Vec2 = Box2D.b2Vec2;
    b2BodyDef = Module.b2BodyDef;
    b2Body = Module.b2Body;
    b2FixtureDef = Module.b2FixtureDef;
    b2PolygonShape = Module.b2PolygonShape;
    b2CircleShape = Module.b2CircleShape;
    b2RevoluteJointDef = Module.b2RevoluteJointDef;
    b2_dynamicBody = Module.b2_dynamicBody;
    b2EdgeShape = Module.b2EdgeShape;
  }

  var bodies = [];

  var world = new b2World(new b2Vec2(0, 10));

  _.each(_.range(20), function(columns) {
    _.each(_.range(12), function(rows) {
      //Circle
      var circleDef = new b2BodyDef();
      if (CURRENT_BOX2D_NAME === 'vanilla') {
        circleDef.type = b2Body.b2_dynamicBody;
        circleDef.position.x = 6 + (columns * 0.3);
        circleDef.position.y = -2 + (rows * 1.1);
      } else {
        circleDef.set_type(Module.b2_dynamicBody);
        circleDef.set_position(new b2Vec2(6 + (columns * 0.3), -2 + (rows * 1.1)));
      }
      var circleBody = world.CreateBody(circleDef);

      bodies.push(circleBody);

      if (CURRENT_BOX2D_NAME === 'vanilla') {
        var circleFixDef = new b2FixtureDef();
        circleFixDef.shape = new b2CircleShape(0.2);
        circleBody.CreateFixture(circleFixDef);
      } else {
        var circleShape = new b2CircleShape();
        circleShape.set_m_radius( 0.2 );
        circleBody.CreateFixture(circleShape, 1.0);
      }
      
    });
  });

  //Floor
  var floorDef = new b2BodyDef();
  floorDef.type = b2Body.b2_staticBody;
  if (CURRENT_BOX2D_NAME === 'vanilla') {
    floorDef.position.x = 0;
    floorDef.position.y = 22;
  } else {
    floorDef.set_position(new b2Vec2(0, 12));
  }
  var floorBody = world.CreateBody(floorDef);

  if (CURRENT_BOX2D_NAME === 'vanilla') {
    var floorFixDef = new b2FixtureDef();
    floorFixDef.shape = new b2PolygonShape();
    floorFixDef.shape.SetAsBox(100, 10);

    floorBody.CreateFixture(floorFixDef);
  } else {
    var shape = new b2EdgeShape();
    shape.Set(new b2Vec2(-20.0, 0.0), new b2Vec2(20.0, 0.0));
    floorBody.CreateFixture(shape, 0.0);
  }

  context.font = "30px Arial";

  var counter = 0;
  var accumulator = 0;

  function format(input) {
    return Math.round((input) * 10) / 10;
  }

  function gameLoop() {
    var loopStart = performance.now();
    world.Step(1/60, 3, 2);
    
    context.fillStyle = '#442222';
    context.fillRect(0, 0, 800, 600);

    for (var i = 0; i < bodies.length; i++) {
      context.fillStyle = '#888888';
      
      var pos = bodies[i].GetPosition();
      var x, y;
      if (CURRENT_BOX2D_NAME === 'vanilla') {
        x = pos.x;
        y = pos.y;
      } else {
        x = pos.get_x();
        y = pos.get_y();
      }
      context.fillRect(x * 45, y * 45, 10, 10);
    }
    // var pos = floorBody.GetPosition();
    // context.fillStyle = '#cccccc';
    // context.fillRect(pos.x * 45, (pos.y - 10) * 45, 1000, 100);

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