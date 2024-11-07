import React, { useState, useEffect, useRef } from 'react';
import styles from './Pong.module.css';

function Pong() {
    const canvasRef = useRef(null);
	const keys = useRef({ lu: false, ld: false, ru: false, rd: false});
	const LPaddle = useRef({ x: 50, y: 250});
	const RPaddle = useRef({ x: 750, y: 250});
	const [score, setScore] = useState({left: 0, right: 0});
	const gameStarted = useRef(false);
    const pos = useRef({ x: 400, y: 250 });
    const obj = useRef({ x: 400, y: 250 });
    const dir = useRef(1);
    const vec = useRef(0.005);
    const speed = useRef(2);
    const lastUpdateTimeRef = useRef(0);
    const [count, setCount] = useState(0);

    document.body.style.backgroundColor = 'black';

    // Counter effect for seconds since start
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCount((prevCount) => prevCount + 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

	useEffect(() => {

		const handleKeyDown = (event) => {
			switch (event.key)
			{
				case 'ArrowUp':
					keys.current.ru = true;
					break;
				case 'ArrowDown':
					keys.current.rd = true;
					break;
				case 'e':
					keys.current.lu = true;
					break;
				case 'd':
					keys.current.ld = true;
					break;
			}
		};
		const handleKeyUp = (event) => {
			switch (event.key)
			{
				case 'ArrowUp':
					keys.current.ru = false;
					break;
				case 'ArrowDown':
					keys.current.rd = false;
					break;
				case 'e':
					keys.current.lu = false;
					break;
				case 'd':
					keys.current.ld = false;
					break;
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
				window.addEventListener('keyup', handleKeyUp);
			};
		}, []);

	const handlePaddlesMovement = () =>
	{
		if (keys.current.lu)
			LPaddle.current.y += (LPaddle.current.y <= 60 ? 0 : -5);
		if (keys.current.ld)
			LPaddle.current.y += (LPaddle.current.y >= 440 ? 0 : 5);
		if (keys.current.ru)
			RPaddle.current.y += (RPaddle.current.y <= 60 ? 0 : -5);
		if (keys.current.rd)
			RPaddle.current.y += (RPaddle.current.y >= 440 ? 0 : 5);
	}

    const handleFaster = () => {
        speed.current = (speed.current >= 100 ? 100 : speed.current + 1);
    };

    const handleSlower = () => {
        speed.current = (speed.current <= 1 ? 1 : speed.current - 1);
    };

	const playAgain = () => {
		if (pos.current.x == 791.1)
			setScore((s) => s = {...s, left: s.left + 1});
		else
			setScore((s) => s = {...s, right: s.right + 1});
		speed.current = 2;
		pos.current = ({ x: 400, y: 250 });
		obj.current = ({ x: 400, y: 250 });
		LPaddle.current = ({ x: 50, y: 250});
		RPaddle.current = ({ x: 750, y: 250});
		vec.current = 0.005;
		nextHit();
	}

	const restartGame = () => {
		gameStarted.current = false;
		pos.current = ({ x: 400, y: 250 });
		obj.current = ({ x: 400, y: 250 });
		LPaddle.current = ({ x: 50, y: 250});
		RPaddle.current = ({ x: 750, y: 250});
		vec.current = 0.005;
		speed.current = 2;
	}
	
	const startGame = () => {

		if (gameStarted.current == true)
			return ;
		gameStarted.current = true;
		setScore({ left: 0, right: 0 });
		vec.current = 0.005;
		speed.current = 2;
		pos.current = ({ x: 400, y: 250 });
		obj.current = ({ x: 400, y: 250 });
	}

	const drawBall = (ctx, x, y) => {
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, 2 * Math.PI);
		ctx.fillStyle = 'white';
		ctx.fill();
	};

	const drawPaddle = (ctx, x, y) => {
		ctx.beginPath();
		ctx.rect(x, y - 60, 10, 120);
		ctx.fillStyle = 'white';
		ctx.fill();
	}

	const drawGame = (ctx) =>
	{
		// Fill background with black
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// Draw center lines
		ctx.beginPath();
		for (let i = 0; i != 500; i += 10)
			ctx.rect(398, i, 4, 1);
		ctx.fillStyle = 'grey';
		ctx.fill();

		drawPaddle(ctx, LPaddle.current.x - 10, LPaddle.current.y);
		drawPaddle(ctx, RPaddle.current.x, RPaddle.current.y);
		drawBall(ctx, pos.current.x, pos.current.y);
	}

	function isPaddleAtLevel(side, y) {
		
		let paddleY = (side == 1 ? RPaddle.current.y : LPaddle.current.y);
		
		if (y > paddleY + 60 || y < paddleY - 60)
			return (false);
		return (true);
	}

	function getNewVector(side, y, oldVec) {

		let paddleY = (side == 1 ? RPaddle.current.y : LPaddle.current.y);
		let newVec = 2 * (Math.abs(paddleY - y) / 60);
		newVec = (newVec < 0.05 ? 0.05 : newVec);
		newVec *= (paddleY - y > 0 ? -1 : 1);
		return (newVec);
	}

    const nextHit = () => {

		// Setting next hit position
		let newY = vec.current > 0 ? 491 : 9;
		let newX = dir.current * ((newY - obj.current.y) / vec.current) + obj.current.x;

		// Checking if the ball is going past a paddle, setting the next position no further than paddle level
		if (((newX > 750 && dir.current == 1) || (newX < 50 && dir.current == -1)) && pos.current.x < 750 && pos.current.x > 50)
		{
			newX = newX > 750 ? 750 : 50;
			newY = dir.current * (newX - obj.current.x) * vec.current + obj.current.y;

		} // If at paddle level, checking if the ball is going to rebound or score a point
		else if (obj.current.x == 750 || obj.current.x == 50)
		{
			// If this side's paddle is in range, the ball bounces off
			if (isPaddleAtLevel(dir.current, pos.current.y) == true)
			{
				vec.current = getNewVector(dir.current, pos.current.y, vec.current);
				dir.current *= -1;
				newY = vec.current > 0 ? 491.1 : 9;
				newX = dir.current * ((newY - obj.current.y) / vec.current) + obj.current.x;
				if (newX >= 750 || newX <= 50) {
					newX = (newX >= 750 ? 750 : 50);
					newY = dir.current * (newX - pos.current.x) * vec.current + pos.current.y;
				}
				handleFaster();
			}
			else // Otherwise, the ball goes to score a point
			{
				newY = vec.current > 0 ? 491 : 9;
				newX = dir.current * ((newY - obj.current.y) / vec.current) + obj.current.x;

				if (newX >= 791 || newX <= 9) {
					newX = (newX >= 791 ? 791.1 : 9);
					newY = dir.current * (newX - pos.current.x) * vec.current + pos.current.y;
					dir.current *= -1;
				}
				else
					vec.current *= -1;
			}
		}
		else // Otherwise, rebound didn't need any verification
		{
			if (newX >= 750 || newX <= 50) {
				newX = (newX >= 750 ? 750 : 50);
				newY = dir.current * (newX - pos.current.x) * vec.current + pos.current.y;
				dir.current *= -1;
			}
			else
				vec.current *= -1;
		}

		pos.current = obj.current;
		obj.current = {x: newX, y: newY};
		console.log("obj: ", obj.current);
		console.log("dir: ", dir.current);
    };

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		const animate = (time) =>
		{
			if (time - lastUpdateTimeRef.current > 1000 / 61) {
				const dx = obj.current.x - pos.current.x;
				const dy = obj.current.y - pos.current.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				handlePaddlesMovement();

				if (distance <= speed.current) {
					pos.current.x = obj.current.x; // Snap to target if close enough
					pos.current.y = obj.current.y;
					drawGame(context);
					if (pos.current.x == 791.1 || pos.current.x == 9)
						playAgain();
					else if (gameStarted.current == true)
						nextHit();
				}
				else
				{
					// Calculate movement step towards the target
					const angle = Math.atan2(dy, dx);
					const newX = pos.current.x + Math.cos(angle) * speed.current;
					const newY = pos.current.y + Math.sin(angle) * speed.current;
					drawGame(context);
					pos.current = {x: newX, y: newY};
					lastUpdateTimeRef.current = time;
				}	
			}
			requestAnimationFrame(animate);

		};
		requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animate);
    }, []);

    return (
        <div className={styles.MovingBall}>
            <canvas ref={canvasRef} width={800} height={500} style={{ border: '5px solid white' }}></canvas>
			<h2>{score.left}:{score.right}</h2>
            <p>Speed: {speed.current}</p>
            <div>
                <button onClick={handleSlower}>Slower</button>
                <button onClick={startGame}>Start</button>
                <button onClick={handleFaster}>Faster</button>
            </div>
			<div>
				<button onClick={restartGame}>Restart</button>
			</div>
            <p>Since start: {count} sec</p>
        </div>
    );
}

export default Pong;
