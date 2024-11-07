#include "mlx.h"
#include <math.h>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <unistd.h>

#define WIN_WIDTH 800
#define WIN_HEIGHT 500

typedef struct {
    void *mlx_ptr;
    void *win_ptr;
} t_mlx;

// Structure to hold a point (x, y)
typedef struct {
    int x;
    int y;
} Point;

// Function to draw a dot (small circle)
void draw_dot(t_mlx *mlx, Point center, int radius, int color) {
    for (int y = -radius; y <= radius; y++) {
        for (int x = -radius; x <= radius; x++) {
            if (x * x + y * y <= radius * radius) {
                mlx_pixel_put(mlx->mlx_ptr, mlx->win_ptr, center.x + x, center.y + y, color);
            }
        }
    }
}

// Function to draw a line using Bresenham's algorithm
void draw_line(t_mlx *mlx, Point p1, Point p2) {
    int dx = abs(p2.x - p1.x);
    int dy = -abs(p2.y - p1.y);
    int sx = (p1.x < p2.x) ? 1 : -1;
    int sy = (p1.y < p2.y) ? 1 : -1;
    int err = dx + dy;

    while (1) {
		draw_dot(mlx, p1, 5, 0xFFFFFF); // White color
		usleep(1000);
		draw_dot(mlx, p1, 5, 0x000000); // Black color
        if (p1.x == p2.x && p1.y == p2.y) break;
        int e2 = 2 * err;
        if (e2 >= dy) { err += dy; p1.x += sx; }
        if (e2 <= dx) { err += dx; p1.y += sy; }
    }
}


int main() {
    t_mlx mlx;

	srand(time(NULL));

    // Initialize MiniLibX and create a window
    mlx.mlx_ptr = mlx_init();
    mlx.win_ptr = mlx_new_window(mlx.mlx_ptr, WIN_WIDTH, WIN_HEIGHT, "Abstract Design");

	Point	pos;
	Point	obj;
	Point	min;
	Point	max;
	int		vec = rand() % 5; // random vector at start
	int		dir = (rand() % 2 ? 1 : -1); // random direction at start

	pos.x = rand() % WIN_WIDTH;
	pos.y = rand() % WIN_HEIGHT;

	max.x = WIN_WIDTH;
	max.y = WIN_HEIGHT;

	min.x = 0;
	min.y = 0;

	while (1)
	{
		// Function to determine the rebound position on the x axis depending on height limits
		obj.y = (vec > 0 ? max.y : min.y);
		obj.x = (dir * ((obj.y - pos.y) / vec)) + pos.x;
		
		// Checking if the x value of the next rebound's is out of bounds
		if (obj.x >= max.x || obj.x <= min.x)
		{
			// Determine the rebound position on the y axis depending on width limits
			obj.x = (obj.x >= max.x ? max.x : min.x);
			obj.y = ((dir * (obj.x - pos.x)) * vec) + pos.y;
			dir *= -1; // Rebound was on left or right side, the ball changes direction
		}
		else
			vec *= -1; // Reboud was on left or right side, the ball changes direction

		draw_line(&mlx, pos, obj);

		// The determined position now becomes the new position
		pos.x = obj.x;
		pos.y = obj.y;

		// Adding randomness to the rebound
		if (vec >= 0) {
			vec = rand() % 5;
			if (!vec)
				vec = 5;
		}
		else {
			vec = (rand() % 5) * -1;
			if (!vec)
				vec = -5;
		}
	}

    // Keep the window open
    mlx_loop(mlx.mlx_ptr);

    return 0;
}