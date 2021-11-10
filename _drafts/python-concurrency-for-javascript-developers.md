with concurrent.futures.ThreadPoolExecutor() as executor:
    executor.map(do_something, list_of_args)