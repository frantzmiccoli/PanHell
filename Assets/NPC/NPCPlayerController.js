#pragma strict

class NPCPlayerController extends MonoBehaviour {

	private var SPEED_MIN : float = 1.5;
	private var SPEED_MAX : float = 1.5;

	private var speed : float;
	

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
		
		//Debug.Log('on collision enter');
		//Debug.Log(collision.collider);
	}
	
	/**
	 * On trigger with a bigger collider that enables collision detection
	 */
	public function OnTriggerEnter (collider : Collider) {
		Debug.Log('---');
		var closestColliderPoint : Vector3 = collider.ClosestPointOnBounds(this.transform.position);
		var currentPosition : Vector3 = this.transform.position;
		var vectorToClosestPoint : Vector3 = closestColliderPoint - currentPosition;
		var absoluteDotProductWithTop = Mathf.Abs(Vector3.Dot(vectorToClosestPoint, Vector3.up));
		
		Debug.Log(absoluteDotProductWithTop);
		
		if ((absoluteDotProductWithTop > 0.4) || (vectorToClosestPoint.magnitude < 0.1)) {
			return; // Nothing to do here we must be colliding with the plan
		}
		Debug.Log('O --- O'); 
		
		Debug.Log(vectorToClosestPoint);
		
		var normalVectorToClosestPoint : Vector3 = Vector3.Normalize(Vector3.Cross(vectorToClosestPoint, Vector3.up));
		
		Debug.Log('New direction'); 
		Debug.Log(normalVectorToClosestPoint);
		Debug.DrawRay(this.transform.position, normalVectorToClosestPoint, Color.green, 10, false);
		
		
		this.transform.forward = normalVectorToClosestPoint;
	}
	
	private function translate() {

		var translationVector : Vector3 = this.transform.forward;
		translationVector *= this.speed;
		translationVector *= Time.deltaTime;
		this.transform.Translate(translationVector);
	}
}