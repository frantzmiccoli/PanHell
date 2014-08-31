#pragma strict

class NPCPlayerController extends MonoBehaviour {

	private var SPEED_MIN : float = 2;
	private var SPEED_MAX : float = 0.5;
	
	private var SAME_DIRECTION_MAX : float = 1;
	private var SAME_DIRECTION_MIN : float = 3;
	
	private var DIRECTION_DEVIATION_SCALE = 0.5;
	
	private var AVOIDANCE_DURATION = 1;
	
	private var VELOCITY_Y_MIN = -0.2;
	private var VELOCITY_Y_MAX = 0.2;

	private var speed : float;
	
	private var alive = true;
	
	private var motor : CharacterMotor;
	private var controller : CharacterController;
	
	private var targetDirection : Vector3;
	private var lastDirectionUpdateDate : float = 0.0;
	
	private var positionsViable = new Array();
	private var positionsBanned = new Array();
	private var positionsLast = new Array();
	private var lastAvoidanceTime : float = 0.0;

	public function Start() {
		this.speed = Random.value * (this.SPEED_MAX - this.SPEED_MIN) + this.SPEED_MIN;
		this.motor = GetComponent(CharacterMotor);
		this.controller = GetComponent(CharacterController);
		this.targetDirection = this.transform.forward;
	}

	public function Update() {
		var timeFromLastAvoidance = Time.time - this.lastAvoidanceTime;
		var inAvoidance = this.AVOIDANCE_DURATION > timeFromLastAvoidance;
	
		if (inAvoidance) {
			this.considerDirectionUpdate();
		}
		this.translate();
		this.updatePositionsInformations();
		if (inAvoidance) {
			return;
		}
		this.handleStuck();
	}
	
	/**
	 * On collision with another object
	 */
	public function OnCollisionEnter (collision : Collision) {
		var colliderName = collision.collider.name;
		if (colliderName.IndexOf('Pan') == -1) {
			return;
		}
		Debug.Log('NPC killed');
		this.alive = false;
		Destroy(this.gameObject, 1.0);
	}
	
	/**
	 * On trigger with a bigger collider that enables collision detection
	 */
	public function OnTriggerEnter (collider : Collider) {
		var closestColliderPoint : Vector3 = collider.ClosestPointOnBounds(this.transform.position);
		var currentPosition : Vector3 = this.transform.position;
		var vectorToClosestPoint : Vector3 = closestColliderPoint - currentPosition;
		var absoluteDotProductWithTop = Mathf.Abs(Vector3.Dot(vectorToClosestPoint, Vector3.up));
		
		if ((absoluteDotProductWithTop > 0.4) || (vectorToClosestPoint.magnitude < 0.1)) {
			return; // Nothing to do here we must be colliding with the plan
		}
		
		var rayToSurface = new Ray(this.transform.position, vectorToClosestPoint);
		var rayHit : RaycastHit;
		if (!(Physics.Raycast(rayToSurface, rayHit, 10))) {
			// This case may occure when an object enters in the sphere but won't raise any real collision
			return;
		}
		var normalToObject = rayHit.normal;
		var reflection = Vector3.Reflect(vectorToClosestPoint, normalToObject);
		reflection.y = 0;		
		
		this.headTo(reflection);
	}
	
	private function translate() {
		if (!this.alive) {
			this.motor.inputMoveDirection = Vector3.zero;
			return;
		}
		var velocityVector = this.controller.velocity;
		velocityVector.Normalize();
		
		if ((velocityVector.y < this.VELOCITY_Y_MIN) || (velocityVector.y > this.VELOCITY_Y_MAX)) {
			velocityVector.y = 0;
		}
		
		if (velocityVector != Vector3.zero) {
			this.transform.forward = this.controller.velocity;
		}
		this.motor.inputMoveDirection = this.targetDirection;
	}
	
	private function updatePositionsInformations() {
		Debug.Log('registering new position');
		this.positionsLast.Push(this.transform.position);
		
		while (this.positionsLast.length > 40) {
			this.positionsLast.Shift();
		}
		
		while (this.positionsViable.length > 100) {
			this.positionsViable.Shift();
		}
		
		
		while (this.positionsBanned.length > 100) {
			this.positionsBanned.Shift();
		}
		
	}
	
	private function handleStuck() {
		Debug.Log('handle Stuck');
	
		var moveQuantity : float = this.getLastPositionsMoveQuantity();
		
		var goodSpeed = (moveQuantity > 0.1);
		if (goodSpeed) {
			Debug.Log('registering good speed');
			this.registerCorrectPosition();
		} 
		
		var stuck = (moveQuantity < 0.01) && (moveQuantity >= 0.0);
		
		Debug.Log(moveQuantity);
		
		
		if (stuck) {	
			Debug.Log('badddd');
			Debug.Log('avoidance code');
			this.registerStuck();
			this.avoidStucking();
		}
	}
	
	private function getLastPositionsMoveQuantity() {
		var summedMoved : float = 0.0;
		var viewed : int = 0;
		
		var previousPosition : Vector3;
		for (var position : Vector3 in this.positionsLast) {
			viewed += 1;
			//var position : Vector3 = this.positionsLast[index] as Vector3;
			if (previousPosition != Vector3.zero) {
				var delta : Vector3 = position - previousPosition;
				summedMoved += delta.magnitude;
			}
			previousPosition = position;
		}
		
		if (viewed < 10) {
			return -1.0;
		}
		
		return summedMoved / viewed;
	}
	
	private function registerStuck() {
		this.positionsBanned.Push(this.transform.position);
	}
	
	private function registerCorrectPosition() {
		var currentPosition = this.transform.position;
		this.positionsViable.Push(currentPosition);
	}
	
	private function avoidStucking() {
		var direction : Vector3;
		if (positionsViable.length > 0) {
			var lastViablePosition : Vector3 = this.positionsViable[positionsViable.length - 1];
			var currentPosition = this.transform.position;
			direction = lastViablePosition - currentPosition;
		} else {
			Debug.Log('No escape position available, picking a random one');
			direction = Vector3(Random.value, 0, Random.value);
			direction.Normalize();
		}
		
		var accessible = !Physics.Raycast(currentPosition, direction, direction.magnitude);
		

		if (accessible) {
			Debug.Log('avoiding problems');
			this.lastAvoidanceTime = Time.time;
			this.headTo(direction);
		} else {
			Debug.LogError('The escape point could be not accessible in... test another one (not implemented)');
		}
	}
	
	private function updateSpeed() {
		var newSpeed = Random.value * (this.SPEED_MAX - this.SPEED_MIN) + this.SPEED_MIN;
		if (this.speed == 0) {
			this.speed = newSpeed;
			return;
		}
		// Exponential average smoothing
		var exponentialFactor = 0.6;
		this.speed = (newSpeed * exponentialFactor) + (this.speed * (1 - exponentialFactor));
	}
	
	private function considerDirectionUpdate() {
		var directionUpdateDelta = Time.time - this.lastDirectionUpdateDate;
		var minExceededTime = directionUpdateDelta - this.SAME_DIRECTION_MIN;
		if (minExceededTime < 0) {
			return;
		}
		var directionUpdateScale = this.SAME_DIRECTION_MIN - this.SAME_DIRECTION_MAX;
		var shouldUpdate = Random.value * directionUpdateScale < minExceededTime;
		if (shouldUpdate) {
			var randomDirection = Vector3(Random.value, 0, Random.value) - Vector3(0.5, 0, 0.5);
			var randomDirectionWeight = this.DIRECTION_DEVIATION_SCALE * Random.value;
			var newDirection = (randomDirectionWeight * randomDirection.normalized) + (this.targetDirection.normalized * (1 - randomDirectionWeight));
			this.headTo(newDirection);
		}
	}
	
	private function headTo(direction : Vector3) {
		this.updateSpeed();
		this.lastDirectionUpdateDate = Time.time;
		this.targetDirection = direction;
	}
}