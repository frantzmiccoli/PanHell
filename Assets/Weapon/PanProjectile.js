﻿#pragma strict
var startHeight : float = 25.0;


private var _killTimer : float = 1;
private var _killMe : int = 0;
private var _startTimer : float = 0.25;

private var AUDIO_CLIP_NAMES = ['pan1', 'pan2', 'pan3', 'pan4'];

private var lastPosition : Vector3; 

function Awake() {
	transform.position.y = startHeight;
	transform.rotation.eulerAngles = Vector3(Random.Range(-30,30),Random.Range(0,360),Random.Range(-60,60));
	rigidbody.AddForce(0,-1000,0);
}

function Update () {
	var currentPosition = this.transform.position;
	
	if (lastPosition != Vector3.zero) {
		 var delta = currentPosition - lastPosition;
		 if (delta.magnitude < 0.1) {
		 	_kill();
		 } 
	}
	this.lastPosition = currentPosition;

	if (_killMe) {
		_killTimer -= Time.deltaTime;
		if (_killTimer <= 0) {
			Destroy(gameObject);
		}
	}
	
	_startTimer -= Time.deltaTime;
}

function OnCollisionEnter(col: Collision) {
	_kill();
}

function _kill() {
	if ((_startTimer <= 0) && (_killMe != 1)) {
		_killMe = 1;
		_killTimer = 1;
		_playSound();
	}
}

function _playSound() {
	var randomIndex : int = this.AUDIO_CLIP_NAMES.length * Random.value;
	var randomClipName =  this.AUDIO_CLIP_NAMES[randomIndex];
	this.gameObject.audio.clip = Resources.Load(randomClipName) as UnityEngine.AudioClip;
	this.gameObject.audio.Play();	
}
