#pragma strict

class NPCPlayerController extends MonoBehaviour {

	private var SPEED_MIN : float = 2;
	private var SPEED_MAX : float = 0.5;
	
	private var SAME_DIRECTION_MAX : float = 1;
	private var SAME_DIRECTION_MIN : float = 3;
	
	private var DIRECTION_DEVIATION_SCALE = 0.5;

	private var speed : float;
	
	private var alive = true;
	
	private var motor : CharacterMotor;
	private var controller : CharacterController;
	
	private var targetDirection : Vector3;
	private var lastDirectionUpdateDate : float = 0.0;
	

	public function Start() {
		this.speed = Random.value * (this.SPEED_MAX - this.SPEED_MIN) + this.SPEED_MIN;
		this.motor = GetComponent(CharacterMotor);
		this.controller = GetComponent(CharacterController);
		this.targetDirection = this.transform.forward;
	}

	public function Update() {
		this.considerDirectionUpdate();
		this.translate();
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
		if (!alive) {
			this.motor.inputMoveDirection = Vector3.zero;
			return;
		}
		this.transform.forward = this.controller.velocity;
		this.motor.inputMoveDirection = this.targetDirection;
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