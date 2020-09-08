import re

if __name__ == '__main__':
    pattern = re.compile(r'^[-+]?[0-9]+\.?[0-9]+$')

    if pattern.match("111.12"):
        print(11)

    a = {"d":1}
    print(a.pop("a"))
    print(a)