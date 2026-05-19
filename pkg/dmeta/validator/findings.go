package validator

const (
	SeverityInfo    = "info"
	SeverityWarning = "warning"
	SeverityError   = "error"
)

type Finding struct {
	Severity string
	Code     string
	Artifact string
	Path     string
	Message  string
	Hint     string
}

func Info(artifact, path, code, message, hint string) Finding {
	return Finding{Severity: SeverityInfo, Artifact: artifact, Path: path, Code: code, Message: message, Hint: hint}
}

func Warning(artifact, path, code, message, hint string) Finding {
	return Finding{Severity: SeverityWarning, Artifact: artifact, Path: path, Code: code, Message: message, Hint: hint}
}

func Error(artifact, path, code, message, hint string) Finding {
	return Finding{Severity: SeverityError, Artifact: artifact, Path: path, Code: code, Message: message, Hint: hint}
}

func HasErrors(findings []Finding) bool {
	for _, f := range findings {
		if f.Severity == SeverityError {
			return true
		}
	}
	return false
}

func HasWarnings(findings []Finding) bool {
	for _, f := range findings {
		if f.Severity == SeverityWarning {
			return true
		}
	}
	return false
}

func ShouldFail(findings []Finding, failOnWarning bool) bool {
	if HasErrors(findings) {
		return true
	}
	return failOnWarning && HasWarnings(findings)
}
