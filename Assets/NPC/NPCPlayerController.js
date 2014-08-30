#pragma strict

class NPCPlayerController extends MonoBehaviour {

	private var SPEED_MIN : float = 1.5;
	private var SPEED_MAX : float = 1.5;

	private var speed : float;
	
	private var alive = true;

	public function Start() {
		this.speed = Random.value * (this.SPEED_MAX - this.SPEED_MIN) + this.SPEED_MIN;
	}

	public function Update() {
		this.translate();
	}
	
	/**
	 * On collision with another object
	 */
	public function OnCollisionEnter (collision : Collision) {
		Debug.Log('NPC killed');
		this.alive = false;
		Destroy(this.gameObject, 1.0);
		//Debug.Log('on collision enter');
		//Debug.Log(collision.collider);
	}
	
	/**
	 * On trigger with a bigger collider that enables collision detection
	 */
	public function OnTriggerEnter (collider : Collider) {
		var closestColliderPoint : Vector3 = collider.ClosestPointOnBounds(this.transform.position);
		var currentPosition : Vector3 = this.transform.position;
		var vectorToClosestPoint : Vector3 = closestColliderPoint - currentPosition;
		var absoluteDotProductWithTop = Mathf.Abs(Vector3.Dot(vectorToClosestPoint, Vector3.up));
		
		Debug.Log(absoluteDotProductWithTop);
		
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
		this.transform.forward = reflection;
	}
	
	private function translate() {
		if (!alive) {
			return;
		}
		var translationVector : Vector3 = Vector3.forward;
		translationVector *= this.speed;
		translationVector *= Time.deltaTime;
		this.transform.Translate(translationVector);
	}
}