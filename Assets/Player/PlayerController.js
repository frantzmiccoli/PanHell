﻿#pragma strict

var cursorTexture : Texture2D;
var cursorMode : CursorMode = CursorMode.ForceSoftware;
var hotSpot : Vector2 = Vector2(175, 175);
var laser : Transform;
private var isFiring : boolean = false;
private var laserOffsetFromGun : Vector3;

var walkSpeed: float = 6; // regular speed
var crchSpeed: float = 3; // crouching speed
var runSpeed: float = 20; // run speed
 
private var chMotor: CharacterMotor;
private var ch: CharacterController;
private var tr: Transform;
private var height: float; // initial height
private var animTimer: float = 0;
private var animTimer2: float = 0;
private var fparms: Transform;
private var fparmsOrigin: Vector3;
function Awake() {
	laser = transform.Find("Main Camera/FirstPersonArm/Laser");
	isFiring = false;
	Screen.showCursor = false; 
	laserOffsetFromGun = laser.transform.localPosition;
	
	chMotor = GetComponent(CharacterMotor);
	tr = transform;
	ch = GetComponent(CharacterController);
	height = ch.height;
	fparms = transform.Find("Main Camera/FirstPersonArm");
	fparmsOrigin = fparms.transform.localPosition;
	
}
function UpdateLaser() {
	//Debug.Log(laser);
	if (isFiring) {
		laser.gameObject.active = true;
		var rayHit : RaycastHit;
    	var ray = Ray(Camera.main.transform.position,Camera.main.transform.forward);
    	if(Physics.Raycast(ray, rayHit)) {
    		var rayVec = rayHit.point - laser.transform.position;
    		laser.transform.localScale.z = rayVec.magnitude;
    		laser.transform.forward = Vector3.Normalize(rayVec);
    	}
		
	} else {
		laser.gameObject.active = false;
	}
}
function Update () {
	UpdateLaser();
	if (ch.isGrounded) {
		animTimer +=  Mathf.Clamp(ch.velocity.magnitude,0.0,10.0)*Time.deltaTime*2.0;
	}
	animTimer2 += Time.deltaTime;
	fparms.localPosition.y = fparmsOrigin.y + 0.05*Mathf.Sin(animTimer) + 0.05*Mathf.PerlinNoise(0.5*animTimer2,0);
	fparms.localPosition.x = fparmsOrigin.x + 0.05*Mathf.Cos(0.5*animTimer) + 0.05*Mathf.PerlinNoise(0,0.5*animTimer2);
	
}

    // Click for Object name and position script
    // ----
     
    var rayHitWorldPosition : Vector3;
    var objectClickedName : String;
    var objectClickedPosition : Vector3;
    var objBall : Transform;
    
     
    // ----
     
function FixedUpdate()
{
    
    hotSpot = Vector2(cursorTexture.height/2,cursorTexture.width/2);
    
    Cursor.SetCursor(cursorTexture, hotSpot, cursorMode);

    // get player input
    if (Input.GetKeyDown(KeyCode.Mouse0))
    {
    	// raycast
    	var rayHit : RaycastHit;
    	var ray = Ray(Camera.main.transform.position,Camera.main.transform.forward);
    	if(Physics.Raycast(ray, rayHit))
    	{
  
    		Instantiate(objBall, rayHit.point, Quaternion.identity);
     
    	}
    } else {
    	isFiring = false;
    }
    
    if (Input.GetAxis("Fire1"))
    {
    	isFiring = true;
    } else {
    	isFiring = false;
    }
    
     var h = height;
	var speed = walkSpeed;
	if (ch.isGrounded && Input.GetKey("left shift") || Input.GetKey("right shift")){
		speed = runSpeed;
	}
	if (Input.GetKey("c")){ // press C to crouch
		h = 0.5 * height;
		speed = crchSpeed; // slow down when crouching
	}
	chMotor.movement.maxForwardSpeed = speed; // set max speed
	var lastHeight = ch.height; // crouch/stand up smoothly
	ch.height = Mathf.Lerp(ch.height, h, 5*Time.deltaTime);
	tr.position.y += (ch.height-lastHeight)/2; // fix vertical position
    
}
     
    // ----

