import os
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("released-versions.sh")


class ReleasedVersions(unittest.TestCase):
    def run_versions(self, manifest, *patches, curl_status=0):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "manifest").write_text(manifest)
            curl = root / "curl"
            curl.write_text('#!/bin/sh\ncat "$FIXTURE"\nexit "$CURL_STATUS"\n')
            curl.chmod(0o755)
            return subprocess.run(
                ["bash", str(SCRIPT), *patches],
                env={**os.environ, "PATH": f"{root}:{os.environ['PATH']}",
                     "FIXTURE": str(root / "manifest"), "CURL_STATUS": str(curl_status)},
                capture_output=True, text=True,
            )

    def test_excludes_future_minor_and_patch_releases(self):
        result = self.run_versions(
            '[pkg.cargo]\nversion = "0.94.0 (abc 2026-01-01)"\n'
            '[pkg.rust]\nversion = "1.93.1 (abc 2026-01-01)"\n'
            '[pkg.rust.target]\nversion = "1.120.0"\n',
            "1.12.1", "1.93.1", "1.93.2", "1.94.1", "1.120.0",
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        expected = [f"1.{minor}.0" for minor in range(94)] + ["1.12.1", "1.93.1"]
        expected.sort(key=lambda version: tuple(map(int, version.split('.'))))
        self.assertEqual(result.stdout.splitlines(), expected)

    def test_discovers_new_stable_without_a_hardcoded_ceiling(self):
        result = self.run_versions('[pkg.rust]\nversion = "1.121.2 (abc)"\n')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.splitlines()[-2:], ["1.121.0", "1.121.2"])

    def test_invalid_or_missing_stable_fails(self):
        for version in ["", "1.94.0-beta.1", "garbage", "1.093.0"]:
            with self.subTest(version=version):
                result = self.run_versions(f'[pkg.rust]\nversion = "{version}"\n')
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(result.stdout, "")
        result = self.run_versions('[pkg.cargo]\nversion = "1.93.0"\n')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "")

    def test_download_failure_fails_even_with_partial_manifest(self):
        result = self.run_versions('[pkg.rust]\nversion = "1.93.0"\n', curl_status=22)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "")

    def test_invalid_patch_fails(self):
        result = self.run_versions('[pkg.rust]\nversion = "1.93.0"\n', "invalid")
        self.assertNotEqual(result.returncode, 0)


if __name__ == "__main__":
    unittest.main()
