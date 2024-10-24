all :
	gcc -Wall -Wextra -Werror pong.c -Lmlx_linux -lmlx_Linux -L/usr/lib -Imlx_linux -lXext -lX11 -lm -lz -o pong

clean :
	rm -f pong

fclean : clean

re : fclean all