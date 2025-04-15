import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Mic, MicOff, PauseCircle, PlayCircle, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

const AudioRecorder: React.FC = () => {
    const waveformRef = useRef<HTMLDivElement | null>(null);
    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioEnded, setIsAudioEnded] = useState(false);

    useEffect(() => {
        waveSurferRef.current = WaveSurfer.create({
            container: waveformRef.current as HTMLDivElement,
            waveColor: 'hsla(0, 0%, 87%, 1)',
            progressColor: '#FF4500',
            cursorWidth: 0,
            barWidth: 2,
            barHeight: 5.5,
            barRadius: 1,
            height: 28,
            hideScrollbar: true,
            backend: 'WebAudio',
        });

        const recordPlugin = RecordPlugin.create({ continuousWaveform: true });
        waveSurferRef.current.registerPlugin(recordPlugin);

        recordPlugin.on('record-end', (blob: Blob) => {
            setAudioBlob(blob);
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        });

        return () => {
            waveSurferRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        waveSurferRef.current?.on('finish', () => {
            setIsAudioEnded(true);
        });
        waveSurferRef.current?.on('play', () => {
            setIsPlaying(true);
            setIsAudioEnded(false);
        });
        waveSurferRef.current?.on('pause', () => {
            setIsPlaying(false);
        });

    }, [isPlaying]);

    const startRecording = async () => {
        if (waveSurferRef.current) {
            setIsRecording(true);
            await (waveSurferRef?.current?.getActivePlugins()?.[0] as RecordPlugin)?.startMic();
            await (waveSurferRef?.current?.getActivePlugins()?.[0] as RecordPlugin)?.startRecording();
        }
    };

    const stopRecording = async () => {
        if (waveSurferRef.current) {
            (waveSurferRef?.current?.getActivePlugins()?.[0] as RecordPlugin)?.stopRecording();
            (waveSurferRef?.current?.getActivePlugins()?.[0] as RecordPlugin)?.stopMic();
            setIsRecording(false);
            setIsAudioEnded(true)
        }
    };

    const handlePlayPause = async () => {
        if (waveSurferRef.current) {
            if (isAudioEnded) {
                waveSurferRef.current.seekTo(0);
                setIsAudioEnded(false);
            }
            waveSurferRef.current.playPause();
        }
    }

    const hanldeClear = () => {
        waveSurferRef.current?.stop();
        setAudioBlob(null);
        setAudioUrl(null);
    }



    return (
        <div className="relative w-full rounded-md">
            <Input placeholder='Izoh' fullWidth suffix={
                audioUrl ?
                    <span
                        onClick={hanldeClear}
                        className="text-primary"
                    >
                        <X width={16} />
                    </span> :
                    <span
                        onClick={isRecording ? stopRecording : startRecording}
                        className="text-primary"
                    >
                        {isRecording ? <MicOff width={20} /> : <Mic width={20} />}
                    </span>
            }
                prefixIcon={audioUrl && <span onClick={handlePlayPause} className="text-primary-foreground">
                    {isPlaying ? <PauseCircle fill='#FF6347' width={25} /> : <PlayCircle fill='#FF6347' width={25} />}
                </span>}

            />
            <div className={cn("top-1 h-8 left-9 flex items-center w-[calc(100%-64px)] right-9 bg-background absolute", (isRecording || audioUrl) ? 'z-10' : '-z-10', isRecording && 'left-0 w-[calc(100%-32px)]')}>
                <div
                    ref={waveformRef}
                    className='w-full'
                    onClick={handlePlayPause}
                ></div>
            </div>
        </div>
    );
};

export default AudioRecorder;

