export const codeSnippets = {
    mutex_lock: `// MUTEX_LOCK
    #include <stdio.h>
    #include <pthread.h>
    #include <unistd.h> 

    #define N 5  


    int spoons[N] = {1, 1, 1, 1, 1};  

    pthread_mutex_t lock;  

    void* philosophers(void* number) {
        int id = *(int*)number; 

        printf("triet gia %d dang nghi...\\n", id);
        sleep(1);  

        pthread_mutex_lock(&lock); 
        if (spoons[id] == 1 && spoons[(id + 1) % N] == 1) {
            //  0 (đang được sử dụng).
            spoons[id] = 0;
            spoons[(id + 1) % N] = 0;

            printf("-- --triet gia %d dang an...\\n", id);
            sleep(2); 

            // dặt lại thìa khi an xong
            spoons[id] = 1;
            spoons[(id + 1) % N] = 1;
            printf("->triet gia %d da an xong va quay lai nghi...\\n", id);
        }

        // Mở khóa mutex để các luồng khác có thể truy cập tài nguyên.
        pthread_mutex_unlock(&lock);
    }

    int main() {
        pthread_t threads[N];  
        int philosophers_ids[N];  

        // Khởi tạo mutex, để đảm bảo đồng bộ trong việc truy cập vào mảng spoons.
        pthread_mutex_init(&lock, NULL);

        // Tạo các luồng
        for (int i = 0; i < N; i++) {
            philosophers_ids[i] = i; 
            pthread_create(&threads[i], NULL, philosophers, &philosophers_ids[i]);
        }

        for (int i = 0; i < N; i++) {
            pthread_join(threads[i], NULL);  // Đợi từng luồng kết thúc trước khi tiến trình chính kết thúc.
        }

        pthread_mutex_destroy(&lock);// giải phóng tài nguyên

        return 0;  
    }`,
    semaphore: `// CÓ SỬ DỤNG SEMAPHORES

        #include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define MAX_N 100

int N;
sem_t spoons[MAX_N]; // Khai báo mảng spoons có kích thước tối đa

void* philosophers(void* number) {
    int id = *(int*)number;

    printf("Triết gia %d đang nghĩ...\n", id);
    sleep(1);

    sem_wait(&spoons[id]);
    sem_wait(&spoons[(id + 1) % N]);
    printf("-- --Triết gia %d đang ăn...\n", id);
    sleep(2);

    sem_post(&spoons[id]);
    sem_post(&spoons[(id + 1) % N]);
    printf("-> Triết gia %d đã ăn xong và quay lại nghĩ...\n", id);
    return NULL;
}

int main() {
    printf("Nhập số lượng triết gia: ");
    scanf("%d", &N);

    pthread_t threads[N];      // Mỗi thread đại diện cho một triết gia
    int philosophers_ids[N];   // Mảng chứa ID của các triết gia

    for (int i = 0; i < N; i++) {
        sem_init(&spoons[i], 0, 1);  // Khởi tạo từng semaphore với giá trị ban đầu là 1
    }

    for (int i = 0; i < N; i++) {
        philosophers_ids[i] = i;
        pthread_create(&threads[i], NULL, philosophers, &philosophers_ids[i]);
    }

    for (int i = 0; i < N; i++) {
        pthread_join(threads[i], NULL);  // Chờ mỗi thread kết thúc
    }

    for (int i = 0; i < N; i++) {
        sem_destroy(&spoons[i]);  // Hủy semaphore giải phóng tài nguyên
    }

    return 0;
}
`,
}