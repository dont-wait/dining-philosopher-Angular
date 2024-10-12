while(True) {
    if(busy) {
        blocked += 1;
        sleep();
    }
    critial_section();
    busy = 1;
    if(blocked) {
        wakeup(process);
        blocked -= 1;
    }
    non_critical_section();
}