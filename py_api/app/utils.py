class Utils:
    @staticmethod
    @staticmethod
    def pip_freeze():
        try:
            from pip._internal.operations import freeze
        except ImportError:  # pip < 10.0
            from pip.operations import freeze

        pkgs = freeze.freeze()
        for pkg in pkgs:
            print(pkg)
