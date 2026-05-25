package metadata

import (
	"os"
	"os/exec"
	"strings"
	"time"
)

func CurrentGeneratedInfo(commandName string) GeneratedInfo {
	wd, _ := os.Getwd()
	command := strings.Join(os.Args, " ")
	if commandName == "" && len(os.Args) > 0 {
		commandName = os.Args[0]
	}
	return GeneratedInfo{
		At:               time.Now().UTC().Format(time.RFC3339),
		By:               commandName,
		Command:          command,
		WorkingDirectory: wd,
		GitCommit:        currentGitCommit(),
	}
}

func currentGitCommit() string {
	cmd := exec.Command("git", "rev-parse", "HEAD")
	out, err := cmd.Output()
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(out))
}
